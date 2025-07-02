import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabaseClient";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerId = session.customer;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );

      await supabase
        .from("users")
        .update({
          stripe_subscription_id: subscription.id,
          stripe_subscription_status: subscription.status,
        })
        .eq("stripe_customer_id", customerId);
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      await supabase
        .from("users")
        .update({
          stripe_subscription_id: subscription.id,
          stripe_subscription_status: subscription.status,
        })
        .eq("stripe_subscription_id", subscription.id);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      await supabase
        .from("users")
        .update({
          stripe_subscription_id: null,
          stripe_subscription_status: null,
        })
        .eq("stripe_subscription_id", subscription.id);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
