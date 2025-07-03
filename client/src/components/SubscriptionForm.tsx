// client/src/components/SubscriptionForm.tsx
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

interface SubscriptionFormProps {
  priceId: string; // The Stripe Price ID for the subscription plan
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch client secret from your backend API route
    // This is where you create a PaymentIntent or SetupIntent on your server.
    const fetchClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/stripe/create-subscription-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization token if your API routes require it (e.g., Supabase JWT)
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}` // Example
          },
          body: JSON.stringify({ priceId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create subscription intent.');
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (priceId) {
      fetchClientSecret();
    }
  }, [priceId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return; // Stripe.js has not yet loaded.
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      // The payment has been processed. You can redirect or show success.
      // The `return_url` in confirmParams will handle the actual redirect.
    }
  };

  if (!clientSecret && !errorMessage) {
    return <p>Loading payment options...</p>;
  }

  if (errorMessage) {
    return <div className="text-red-500">Error: {errorMessage}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} className="mt-4 bg-blue-500 text-white p-2 rounded disabled:opacity-50">
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
};

export default SubscriptionForm;

