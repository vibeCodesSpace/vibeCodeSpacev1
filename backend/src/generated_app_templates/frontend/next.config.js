// generated_app/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The 'env' object makes environment variables available to the client-side code.
  // Only variables prefixed with 'NEXT_PUBLIC_' are exposed. This is a security feature.
  // These variables are "baked in" at build time.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
};

module.exports = nextConfig;
