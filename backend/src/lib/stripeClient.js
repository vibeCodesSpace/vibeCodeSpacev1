// vibeCodeSpace_clone/backend/src/lib/stripeClient.js
const Stripe = require('stripe');
const { supabase } = require('./supabase/server');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a new Stripe customer or retrieves an existing one.
 * @param {string} userId - The user's ID from Supabase.
 * @param {string} email - The user's email.
 * @returns {Promise<string>} The Stripe Customer ID.
 */
async function findOrCreateCustomer(userId, email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error) throw error;

  if (data?.stripe_customer_id) {
    return data.stripe_customer_id;
  }

  // Create a new customer in Stripe
  const customer = await stripe.customers.create({
    email: email,
    metadata: { supabase_user_id: userId },
  });

  // Update the user's profile with the new Stripe customer ID
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  if (updateError) throw updateError;

  return customer.id;
}

module.exports = {
  stripe,
  findOrCreateCustomer,
};
