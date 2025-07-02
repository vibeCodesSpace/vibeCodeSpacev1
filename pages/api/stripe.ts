import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (req.url === "/api/stripe/create-checkout-session") {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data: user } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: req.auth.user?.emailAddresses[0].emailAddress,
        });
        customerId = customer.id;
        await supabase
          .from("users")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        customer: customerId,
      });

      return res.status(200).json({ url: session.url });
    } else if (req.url === "/api/stripe/create-portal-session") {
      const { userId } = getAuth(req);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { data: user } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      if (!user || !user.stripe_customer_id) {
        return res.status(404).json({ error: "User not found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      });

      return res.status(200).json({ url: session.url });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
