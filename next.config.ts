import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets the dev server accept requests (incl. HMR websocket) via Cloudflare quick tunnels.
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
