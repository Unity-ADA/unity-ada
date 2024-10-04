import { general_links } from "@/utils/Interfaces";

interface dapp {
  name: string;
  description: string;
  image: string;
  category: string;
  links: general_links;
};

const dapp: dapp[] = [
  {
    name: "Minswap",
    description: "Minswap is a multi-pool decentralized exchange that runs on the Cardano Blockchain.",
    image: "https://github.com/Unity-ADA/Unity/blob/main/public/token-images/minswap.png?raw=true",
    category: "Dex",
    links: {
      discord: "https://discord.gg/minswap",
      twitter: "https://twitter.com/MinswapDEX",
      website: "https://minswap.org/",
      reddit: "https://reddit.com/r/MinSwap",
      github: "https://github.com/minswap"
    }
  },
  {
    name: "DexHunter",
    description: "HUNT is the utility token of DexHunter, an advanced trading platform with dex aggregation, market alerts, and a smooth interface.",
    image: "https://github.com/Unity-ADA/Unity/blob/main/public/token-images/hunt.webp?raw=true",
    category: "Dex Aggregator",
    links: {
      twitter: "https://x.com/DexHunterIO",
      website: "https://dexhunter.io/",
    },
  },
];

export default dapp;