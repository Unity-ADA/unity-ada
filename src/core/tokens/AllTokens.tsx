"use client"

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";

import Chip from "@/components/Chip";
import Icon from "@/components/Icons";
import LimitedParagraph from "@/components/LimitedParagraph";
import ProjectCard from "@/components/ProjectCard";
import ToolTip from "@/components/Tooltip";
import token from "@/unity/tokens";
import { FC, useState } from "react";

const AllTokens: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered_tokens = token.filter((item) =>
    item.information.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.information.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Breadcrumb active_page="Tokens"/>

      <div className="py-4 px-2">

        <div className="flex justify-between items-center w-full">
          <div className='flex items-center gap-2'>
            <h3 className="text-lg uppercase font-bold tracking-wider text-neutral-300">
              <code>Verified <span className="text-violet-400">Tokens</span></code>
              <div className="border-2 border-violet-400 w-full"/>
            </h3>
          </div>

          <div className="max-w-sm flex items-center">
            <ToolTip text="You can search using Name, Ticker or Category.">
              <Icon icon="info" extra_class="size-6 mr-4 text-neutral-600" bold_type="bold"/>
            </ToolTip>

            <input
              type="text" 
              placeholder="Search Tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-4 block w-full rounded-md text-sm bg-neutral-950 border-2 border-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-violet-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mx-auto gap-y-8 mt-2 py-2">
          { filtered_tokens.map((t, i) => (<ProjectCard key={i} token={t}/>))}
        </div>
      </div>
    </div>
  );
};

export default AllTokens;