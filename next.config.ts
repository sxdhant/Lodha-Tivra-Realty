import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets the dev server accept requests (incl. HMR websocket) via Cloudflare quick tunnels.
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    // Placeholder photography is served from Unsplash. Add your own image host here,
    // or put renders in /public and reference them by path.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
