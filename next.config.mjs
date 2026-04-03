import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wagmiConnectorsEsm = path.resolve(
  __dirname,
  "node_modules/@wagmi/connectors/dist/esm"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Avoid `wagmi/connectors` barrel: it pulls every connector (porto, MetaMask, …)
      // and breaks Next.js unless all optional peers are installed.
      "@pipe-wagmi/baseAccount": path.join(wagmiConnectorsEsm, "baseAccount.js"),
      "@pipe-wagmi/walletConnect": path.join(wagmiConnectorsEsm, "walletConnect.js"),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.vercel.app", pathname: "/**" },
    ],
  },
};

export default nextConfig;
