// vibeCodeSpace_clone/frontend/components/SubscriptionManager.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SubscriptionManager = ({ userPlan }) => {

  const handleCheckout = async (priceId) => {
    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Could not redirect to checkout. Please try again.');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/payments/create-portal-session', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      alert('Could not open subscription management. Please try again.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h2>Subscription Management</h2>
      <p>Your current plan: <strong>{userPlan || 'free'}</strong></p>
      
      {userPlan === 'free' ? (
        <div>
          <p>Upgrade to the Pro plan for more generations and premium features!</p>
          {/* Replace with your actual Stripe Price ID */}
          <button onClick={() => handleCheckout('price_YOUR_PRO_PLAN_ID')}>
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <button onClick={handleManageSubscription}>
          Manage Your Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionManager;
