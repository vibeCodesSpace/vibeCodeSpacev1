// vibeCodeSpace_clone/frontend/pages/checkout.js
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import EmbeddedCheckoutForm from '../components/EmbeddedCheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'pro-plan' }] }), // Example item
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <h1>Embedded Checkout</h1>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <EmbeddedCheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutPage;
