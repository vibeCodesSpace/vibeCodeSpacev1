// vibeCodeSpace_clone/backend/src/routes/payments.js
const express = require("express");
const { stripe, findOrCreateCustomer } = require("../lib/stripeClient");
const { supabase } = require("../lib/supabase/server");

const router = express.Router();

// Placeholder for JWT authentication middleware
const authenticateUser = (req, res, next) => {
  req.user = { id: "mock-user-id-123", email: "test@example.com" }; // Mock user
  next();
};

// Create a Payment Intent for embedded checkout
router.post("/create-payment-intent", authenticateUser, async (req, res) => {
  try {
    const { items } = req.body; // items should be an array of products
    // A real implementation would calculate the order amount based on the items
    const amount = 1999; // Example: $19.99

    const customerId = await findOrCreateCustomer(req.user.id, req.user.email);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Could not create payment intent." });
  }
});

// 1. Create a Stripe Checkout Session
router.post("/create-checkout-session", authenticateUser, async (req, res) => {
  try {
    const { priceId } = req.body; // e.g., price_12345
    const customerId = await findOrCreateCustomer(req.user.id, req.user.email);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Could not create checkout session." });
  }
});

// 2. Create a Stripe Customer Portal Session
router.post("/create-portal-session", authenticateUser, async (req, res) => {
  try {
    const customerId = await findOrCreateCustomer(req.user.id, req.user.email);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: "Could not create portal session." });
  }
});

// 3. Stripe Webhook Handler
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const plan = subscription.items.data[0].price.lookup_key; // e.g., 'free' or 'pro'

        await supabase
          .from("profiles")
          .update({ plan: plan })
          .eq("stripe_customer_id", customerId);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  },
);

module.exports = router;
