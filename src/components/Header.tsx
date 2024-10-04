

import { FC } from "react";
import Chip from "@/components/Chip";
import curator from "@/unity/curator";
import pool from "@/unity/pool";
import token from "@/unity/tokens";
import ColouredChip from "./ColouredChip";

interface HeaderProps {
  token?: token;
  pool?: pool;
  curator?: curator;
}

const Header: FC <HeaderProps> = ({ token, pool, curator }) => {
  let header_image = "https://pbs.twimg.com/profile_banners/1586189651693522944/1722296681/1500x500";
  let name = "";
  let ticker = "";
  let category = "";
  let logo = "";
  let type = ""

  if (token) {
    name = token.information.name;
    ticker = token.information.ticker;
    category = token.category;
    logo = token.images.main;
    type = "Token";
    if (token.images.header) { header_image = token.images.header; }
  }

  if (pool) {
    name = pool.information.name;
    ticker = pool.information.ticker;
    logo = pool.images.main;
    type = "Pool";
    if (pool.images.header) { header_image = pool.images.header; }
  }

  if (curator) {
    name = curator.curator_information.name;
    logo = curator.images.main;
    type = "Curator";
    if (curator.images.header) { header_image = curator.images.header; }
  }

  return (
    <div className="flex rounded-t-lg bg-top-color w-full relative">
      <div className="absolute inset-0">
        <img
          src={header_image}
          alt="Header Image"
          className="h-full w-full object-cover object-center rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-950 opacity-70"></div>
      </div>

      <div className="h-30 w-30 my-4 rounded-lg mx-4 my-2 relative z-1">
        <img src={logo}/>
      </div>

      <div className="w-full sm:text-center px-5 z-1 py-2">
        <p className="font-poppins font-bold text-neutral-200 sm:text-4xl text-2xl my-0.5 text-center">
          {name}
        </p>

        {(token || pool) && (
          <h3 className="font-poppins tracking-wider font-bold text-heading text-xl my-0.5 justify-center text-center text-violet-400">
            {'[' + ticker + ']'}
          </h3>
        )}

        <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
          <div className="">
            <ColouredChip text={type} size="xs" color="sky"/>
          </div>
          <div className="">
            {token && (<ColouredChip text={category} size="xs" color="neutral"/>)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;