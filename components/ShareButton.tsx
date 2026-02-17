"use client";

import { useFarcasterSDK } from "@/hooks/useFarcasterSDK";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pipe-dream-delta.vercel.app";

export function ShareButton({ score }: { score: number }) {
  const sdk = useFarcasterSDK();
  const shareUrl = APP_URL;
  const text = `I scored ${score} in Pipe Dream! Flow. Loop. Score. 🎮`;

  const handleShare = () => {
    if (sdk?.actions?.openUrl) {
      const encoded = encodeURIComponent(shareUrl);
      const castUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encoded}`;
      sdk.actions.openUrl(castUrl);
    } else {
      if (navigator.share) {
        navigator.share({
          title: "Pipe Dream",
          text,
          url: shareUrl,
        });
      } else {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + shareUrl)}`,
          "_blank"
        );
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-6 py-3 rounded-lg font-medium border border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
    >
      Share Score
    </button>
  );
}
