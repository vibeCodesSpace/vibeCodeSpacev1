// vibeCodeSpace_clone/backend/src/middleware/checkUsage.js
const { supabase } = require('../lib/supabase/server');

const PLAN_LIMITS = {
  free: 5,
  pro: 50,
  enterprise: Infinity,
};

async function checkUsage(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const userId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plan, generations_used')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile for usage check:', error);
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const { plan, generations_used } = profile;
    const limit = PLAN_LIMITS[plan] || 0;

    if (generations_used >= limit) {
      return res.status(429).json({
        error: 'Usage limit reached',
        message: `You have used your ${limit} available generations. Please upgrade to continue.`,
        upgradePath: '/pricing', // Direct users to the upgrade page
      });
    }

    // Attach profile to request for later use (e.g., incrementing usage)
    req.profile = profile;
    next();
  } catch (err) {
    console.error('Unexpected error in checkUsage middleware:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { checkUsage };
