import { general_links, images, pool_information } from "@/utils/Interfaces";
import { curators_id } from "@/utils/Types";

interface pool {
  slug: string;
  information: pool_information;
  images: images;
  curated_by: curators_id[];
  links: general_links;
}

const pool: pool[] = [
  {
    slug: "dave",
    information: {
      name: "Dave Pool",
      ticker: 'DAVE',
      pool_id: "pool1t6n7rysk6wzm9wqxda6zxpzmm3j6256fs3mp06dc26n6503hhj4",
      hash: "5ea7e19216d385b2b8066f7423045bdc65a55349847617e9b856a7aa",
      drep: "drep1yzzd7prdl628lwac455e0sc5wtw2fldg3f2th6jg7r5c7pvf3mk"
    },
    links: {
      twitter: 'https://x.com/ItsDave_ADA'
    },
    images: {
      main: 'https://pbs.twimg.com/profile_images/1764043343984566272/TINMKoc8_400x400.jpg',
      header: 'https://pbs.twimg.com/profile_banners/85322250/1725529839/1500x500'
    },
    curated_by: ["ashe"]
  },
  {
    slug: "pfl01",
    information: {
      name: "Pool for Lovelace 01",
      ticker: "PFL01",
      pool_id: 'pool1yjlmvfck6a2mhup4ljel06r635e9lhs0qsrzu6f2luepvsd42lv',
      hash: '24bfb62716d755bbf035fcb3f7e87a8d325fde0f04062e692aff3216'
    },
    images: {
      main: 'https://poolforlovelace.me/img/pfl_icon.jpeg',
    },
    curated_by: ["ashe"],
    links: {
      website: "https://poolforlovelace.me/"
    },
  },
  {
    slug: "balnc",
    information: {
      name: "Balance Stake Pool",
      ticker: "BALNC",
      pool_id: 'pool15s7w4spg5ee7n7rprhs0dq78plw2mhjkpu5v97uvl27gz2way7z',
      hash: 'a43ceac028a673e9f8611de0f683c70fdcadde560f28c2fb8cfabc81'
    },
    images: {
      main: 'https://dclgnjbi9pxjaanf.public.blob.vercel-storage.com/ba_logo_64.png',
    },
    curated_by: ["ashe"],
    links: {
      website: "https://www.balanceanalytics.io/"
    }
  },
  {
    slug: "mana",
    information: {
      name: "MANA Pool",
      ticker: "MANA",
      pool_id: 'pool1tpy5yawzpetcverves0h6xdycxgrstehfvrkygydt9jcqxwpw3j',
      hash: '58494275c20e5786646ccc1f7d19a4c190382f374b0762208d596580'
    },
    images: {
      main: 'https://mine-ada.com/logo-pool-64x64.png',
    },
    curated_by: ["ashe"],
    links: {
      website: "https://mine-ada.com/"
    }
  },
  {
    slug: "pxlz",
    information: {
      name: "PXLZ Staking Pool",
      ticker: "PXLZ",
      pool_id: 'pool1enul577he3e0s500lv8z98m6k936uecz2rpckxxmmk8c7k0n2rd',
      hash: 'ccf9fa7bd7cc72f851effb0e229f7ab163ae670250c38b18dbdd8f8f'
    },
    images: {
      main: 'https://pxlz.org/favicon.png',
    },
    curated_by: ["ashe"],
    links: {
      website: "https://pxlz.org/"
    }
  },
  {
    slug: "happy",
    information: {
      name: "HAPPY Staking Pool",
      ticker: "HAPPY",
      pool_id: 'pool1a8n7f97dmgtgrnl53exccknjdchqxrr9508hlxlgqp6xvjmzhej',
      hash: 'e9e7e497cdda1681cff48e4d8c5a726e2e030c65a3cf7f9be8007466'
    },
    images: {
      main: 'https://happystaking.io/icon-64x64.png',
    },
    curated_by: ["ashe"],
    links: {
      website: "https://happystaking.io/"
    },
  },
];

export default pool;