import { FC } from "react";

import Icon from "@/components/Icons";
import Button from "@/components/Button";
import LimitedParagraph from "@/components/LimitedParagraph";
import { title_and_data } from "@/utils/Interfaces";
import Card from "@/components/Card";
import token from "@/unity/tokens";
import dapp from "@/unity/dapp";
import curator from "@/unity/curator";
import Chip from "@/components/Chip";


const About: FC = () => {
  const about_information: title_and_data[] = [
    {
      title: "Verified Tokens",
      data: `
        Thanks to the Unity Platform's Curator Program, you can check out the information
        of your favourite tokens that have been verified by our curators. The program ensure's
        only authentic tokens are listed, saving the user from investing into a duplicate
        pretending to be that token.
      `,
      url: "/tokens",
    },
    {
      title: "Unity Forums",
      data: `
        The Unity Forums take advantage of Cardano's CIP-8 technology allowing
        anyone to engage with their Browser Wallet all for free with zero signup!
        Ada Handles are also supported!
      `,
    }
  ];

  const unity_stats: title_and_data[] = [
    {
      title: "Verified Tokens",
      data: token.length.toLocaleString()
    },
    {
      title: "Verified Apps",
      data: dapp.length.toLocaleString()
    },
    {
      title: "Unity Curators",
      data: curator.length.toLocaleString()
    },
  ];

  return (
    <div className='subgrid'>
      
      <div className="flex py-6 gap-2 justify-center flex-wrap subgrid">
        {unity_stats.map((item, index) => {
          return (
            <div key={index} className="flex">
              <Chip icon='logo' text={item.title + ": " + item.data} size="xs"/>
            </div>
          )}
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {about_information.map((item, i) => {
          let icon = "coin_solid";
          let fill = "fill-violet-500";
          let btn_txt = "Explore Tokens";
          let btn_url = "/tokens"
          if (i === 1) { icon = "write_solid"; fill = "fill-yellow-500"; btn_txt = "Enter Forums"; btn_url = "/forums" }

          return (
            <div key={i} className="w-full md:w-100">
              <Card extra_class="">
                <div className="mt-2 flex flex-col justify-center group flex-wrap gap-2 items-center">
                  <h3 className="text-neutral-300 text-md uppercase font-bold tracking-wider">{item.title}</h3>
                </div>
                <div className='my-2 rounded-md border-2 border-neutral-900 bg-neutral-950/20 px-2'>
                  <div className="h-30 px-4 py-2 text-sm text-neutral-300 break-words text-center overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
                    <code>{item.data}</code>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center py-2">
                  <Button icon={icon} text={btn_txt} size="xs" url={btn_url} class_extra={fill}/>
                </div>
              </Card>
            </div>
          )}
        )}
      </div>
    </div>

  );
};

export default About;