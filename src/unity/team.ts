import { general_links } from "@/utils/Interfaces";
import { curators_id } from "@/utils/Types";

interface team_members {
  name:          string;
  stake_wallets: string[];
  links?:        general_links;
  curator_id?:   curators_id;
};

interface team {
  slug:         string;
  team_members: team_members[];
};

const team: team[] = [
  {
    slug: "unity",
    team_members: [
      {
        name: "Ashe. T",
        stake_wallets: [
          "stake1u8jka9zheupfhj2jvzwc074rcqqp4sj9kgkww87qf2jwglqvdp5g2",
        ],
        links: {
          twitter: "https://x.com/_ashet",
          discord_handle: "@ashetaylor"
        },
        curator_id: "ashe"
      }
    ]
  },
  {
    slug: "mom",
    team_members: [
      {
        name: "LUGDOR",
        stake_wallets: [
          "stake1uyskt0pytrpjcc3lye4l5kwx3ls44x0ea7l2y7nvwfm386cjmuljw",
        ],
        links: {
          discord_handle: "@lugdor"
        }
      }
    ]
  }
];

export default team;