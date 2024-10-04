import { general_links, images, token_information } from "@/utils/Interfaces";
import { curators_id } from "@/utils/Types";

interface token {
  slug: string;
  category: string;
  information: token_information;
  images: images;
  curated_by: curators_id[];
  links: general_links;
}

const token: token[] = [
  {
    slug: "unity",
    category: "Utility",
    information: {
      name: "Unity",
      ticker: "UNY",
      description: `
        Unity offers an intuitive user interface and a comprehensive suite of tools, making it a
        valuable resource for both developers and investors in the Cardano ecosystem.
        The platform's dashboard is designed to be user-friendly, catering to the needs of both
        developers and investors without overwhelming them with a complex interface.
      `,
      supply: 0,
      decimals: 0,
      fingerprint: "",
      policy_id: "",
      policy_id_full: ""
    },
    images: {
      main: "https://github.com/Unity-ADA/Unity/blob/main/public/token-images/unity.svg?raw=true",
    },
    curated_by: ["ashe"],
    links: {
      discord: "https://discord.gg/Vx6U85nbQt",
      twitter: "https://x.com/UnityCardano",
      github: "https://github.com/unity-cardano"
    }
  },
  {
    slug: 'mom',
    information: {
      name: 'MOM Token',
      ticker: 'MOM',
      description: `
        YOUR $MOM ON CARDANO
      `,
      supply: 2000000000,
      decimals: 5,
      fingerprint: 'asset1q6y3m5emf2wylp6whr8fxckrd76cwe8xl37nnv',
      policy_id: 'ed5517ccf67c60004355cee3c546c77226cd89a04b3aaeae6a65589e',
      policy_id_full: 'ed5517ccf67c60004355cee3c546c77226cd89a04b3aaeae6a65589e4d6f6d'
    },
    images: {
      main: 'https://momonada.github.io/main/public/assets/main_image.jpg',
      header: 'https://momonada.github.io/main/public/assets/background.jpg',
    },
    category: 'Meme',
    curated_by: ["ashe"],
    links: {
      discord: "https://discord.gg/CueKtH2Cs9",
      telegram: "https://t.me/+7ndbw5QA7ppkOGFk",
      twitter: "https://x.com/mom_on_ada",
      website: "https://momonada.github.io/main/",
    },
  },
];

export default token;