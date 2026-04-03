import { baseAccount } from "@pipe-wagmi/baseAccount";
import { walletConnect } from "@pipe-wagmi/walletConnect";
import { injected } from "@wagmi/core";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { mainnet } from "wagmi/chains";

import { getTargetChain } from "@/lib/publicEnv";

const target = getTargetChain();
const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [target, mainnet],
  connectors: [
    injected(),
    baseAccount({
      appName: "Pipe Dream",
    }),
    ...(wcProjectId
      ? [
          walletConnect({
            projectId: wcProjectId,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [target.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
