import { defineChain } from "viem";

export const blockdagTestnet = defineChain({
  id: 1043,
  name: "BlockDAG Primordial",
  network: "blockdag-primordial-testnet",
  nativeCurrency: { name: "BDAG", symbol: "BDAG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.primordial.bdagscan.com"] },
    public: { http: ["https://rpc.primordial.bdagscan.com"] },
  },
  blockExplorers: {
    default: { name: "BDAGScan", url: "https://primordial.bdagscan.com" },
  },
  testnet: true,
});
