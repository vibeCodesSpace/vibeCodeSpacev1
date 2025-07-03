// client/src/pages/subscribe.tsx
import SubscriptionForm from '../components/SubscriptionForm';
import React from 'react';

const SubscribePage: React.FC = () => {
  // You'd fetch available plans and their priceIds from your backend or Stripe
  const premiumPriceId = 'price_12345'; // Replace with your actual Stripe Price ID

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Your VibeCode Plan</h1>
      <p className="mb-4">Upgrade to Premium for unlimited app generations and advanced features!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Tier Info */}
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Free Plan</h2>
          <p className="text-gray-600 mb-4">Limited app generations per month.</p>
          <ul className="list-disc list-inside mb-4">
            <li>5 app generations/month</li>
            <li>Basic features</li>
            <li>Standard support</li>
          </ul>
          <button className="bg-gray-300 text-gray-800 p-2 rounded cursor-not-allowed">Current Plan</button>
        </div>

        {/* Premium Plan Option */}
        <div className="border p-6 rounded-lg shadow-md bg-purple-50">
          <h2 className="text-xl font-semibold mb-2">Premium Plan</h2>
          <p className="text-gray-600 mb-4">Unlock unlimited potential with VibeCode Premium!</p>
          <ul className="list-disc list-inside mb-4">
            <li>Unlimited app generations</li>
            <li>Advanced AI models</li>
            <li>Priority support</li>
            <li>Custom domains for generated apps</li>
          </ul>
          <SubscriptionForm priceId={premiumPriceId} />
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;

