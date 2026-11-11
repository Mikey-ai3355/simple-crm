/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output → self-contained Node server for Netlify (all data
  // fetches are server-side, so the app must run as a Node process, not static).
  output: 'standalone',
};

export default nextConfig;
