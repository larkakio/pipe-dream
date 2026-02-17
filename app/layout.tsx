import type { Metadata } from "next";
import "./globals.css";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pipe-dream.vercel.app";

const FC_EMBED = {
  version: "1",
  imageUrl: `${APP_URL}/hero-image.png`,
  button: {
    title: "Play Pipe Dream",
    action: {
      type: "launch_frame",
      name: "Pipe Dream",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/hero-image.png`,
      splashBackgroundColor: "#0a0e1a",
    },
  },
};

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
    "fc:miniapp": JSON.stringify(FC_EMBED),
    "fc:frame": JSON.stringify(FC_EMBED),
    "base:app_id": "pipe-dream",
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
        {children}
      </body>
    </html>
  );
}
