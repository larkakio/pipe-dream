"use client";

import { useAccount } from "wagmi";

export function useFarcasterSDK() {
  const { address } = useAccount();

  const user = address
    ? {
        fid: 0,
        displayName: `${address.slice(0, 6)}…${address.slice(-4)}`,
      }
    : null;

  const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const actions = { openUrl };
  return {
    user,
    openUrl,
    actions,
    sdk: {
      actions,
    },
  };
}
