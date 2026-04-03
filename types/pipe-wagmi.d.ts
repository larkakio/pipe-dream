/** Webpack resolves these to `@wagmi/connectors` implementation files (see next.config.mjs). */
declare module "@pipe-wagmi/baseAccount" {
  export { baseAccount } from "@wagmi/connectors";
}

declare module "@pipe-wagmi/walletConnect" {
  export { walletConnect } from "@wagmi/connectors";
}
