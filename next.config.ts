import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

// Location pages were cut from 60 to 8 on 2026-09-20; on 2026-09-24 Exeter
// was dropped and Looe, Newquay and Wadebridge added (Adam's areas list). Every retired address
// still resolves: a trade page for a kept town lands on that town, anything
// under a dropped town lands on the web design page.
const KEPT_TOWNS = 'saltash|plymouth|torpoint|callington|liskeard|tavistock|truro|looe|newquay|wadebridge';
const DROPPED_TOWNS = 'bristol|bath|taunton|torquay|bournemouth|poole|gloucester|swindon|cheltenham|exeter';

const nextConfig: NextConfig = {
  // The health-report PDF reads its fonts from disk at render time; tracing
  // can't see a path built with path.join, so ship the folder explicitly.
  outputFileTracingIncludes: {
    '/api/audit/report': ['./src/lib/pdf/fonts/**/*', './src/lib/pdf/assets/**/*'],
  },
  async redirects() {
    return [
      { source: `/web-design/:town(${KEPT_TOWNS})/:trade`, destination: '/web-design/:town', permanent: true },
      { source: `/web-design/:town(${DROPPED_TOWNS})`, destination: '/services/web-design', permanent: true },
      { source: `/web-design/:town(${DROPPED_TOWNS})/:trade`, destination: '/services/web-design', permanent: true },
    ];
  },
  async headers() {
    // Media under these paths never changes in place: a new version gets a new
    // filename. Without this Vercel serves /public with max-age=0.
    // /world/scrub-engine.js is deliberately left out — it is code and is edited in place.
    const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
    return [
      { source: '/world/vid/:path*', headers: immutable },
      { source: '/world/:file(.*\\.webp)', headers: immutable },
      { source: '/images/:path*', headers: immutable },
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
