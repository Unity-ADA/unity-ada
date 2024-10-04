import { images, curator_information, general_links } from "@/utils/Interfaces";
import { curators_id } from "@/utils/Types";

interface curator {
  id: curators_id;
  curator_information: curator_information;
  links: general_links;
  images: images;
}

const curator: curator[] = [
  {
    id: "ashe",
    curator_information: {
      name: "Ashe. T",
      description: `
        Senior Software Engineer, a High Teacher day-to-day, and a builder in Cardano ecospace. Unity ($UNY) developer and founder.
      `,
    },
    links: {
      twitter: "https://x.com/_AsheT",
      discord_handle: "@ashetaylor"
    },
    images: {
      main: "https://pbs.twimg.com/profile_images/1815817953813692416/KaOUj2KR_400x400.jpg",
      header: 'https://pbs.twimg.com/profile_banners/1586189651693522944/1722296681/1500x500',
    }
  },
];

export default curator;