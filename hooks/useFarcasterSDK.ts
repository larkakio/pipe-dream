"use client";

import { useEffect, useState } from "react";

export function useFarcasterSDK() {
  const [sdk, setSdk] = useState<{
    actions: { ready: () => Promise<void>; openUrl?: (url: string) => void };
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    import("@farcaster/miniapp-sdk")
      .then((mod: { default?: { actions: { ready: () => Promise<void>; openUrl?: (url: string) => void } } }) => {
        if (mounted) setSdk(mod.default ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return sdk;
}
