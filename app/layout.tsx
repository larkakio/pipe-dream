import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pipe-dream-delta.vercel.app";

export const metadata: Metadata = {
  title: "Pipe Dream — Mini App",
  description: "Classic pipe puzzle game on Base & Farcaster",
  openGraph: {
    images: [{ url: `${APP_URL}/hero-image.png`, width: 1200, height: 630 }],
  },
  other: {
    viewport:
      "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover",
    "theme-color": "#0a0e1a",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "base:app_id": "699432097ca07f5750bbdc85",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[var(--bg-primary)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
