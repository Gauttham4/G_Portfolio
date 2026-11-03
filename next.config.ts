import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// The hero audio control only appears when the song file exists at build/start time.
const heroAudio = fs.existsSync(path.join(process.cwd(), "public", "audio", "hero-theme.mp3")) ? "1" : "";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_HERO_AUDIO: heroAudio },
  devIndicators: false,
  images: { qualities: [75, 90] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https://images.unsplash.com",
              "media-src 'self' blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src 'self'",
              "connect-src 'self' https://*.unsplash.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
