import Button from "@/components/Button";
import { FEATURED_PROJECTS } from "@/consts/global";
import dapp from "@/unity/dapp";
import token from "@/unity/tokens";
import { FC } from "react";
import ProjectCard from "../../components/ProjectCard";

const Featured: FC = () => {
  const f_tokens = token.filter((group) => FEATURED_PROJECTS.TOKENS.includes(group.slug));
  const f_dapps = dapp.filter((group) => FEATURED_PROJECTS.APPS.includes(group.name));

  return (
    <div className="py-10">
    <div className='flex justify-center mt-10 subgrid grid grid-cols-1 md:grid-cols-2 gap-4'>

      <div>
        <div className='flex items-center justify-between px-4 py-1'>
          <div className='flex items-center gap-2'>
            <h3 className="text-lg uppercase font-bold tracking-wider text-neutral-300">
              <code>Verified <span className="text-violet-400">Tokens</span></code>
              <div className="border-2 border-violet-400 w-full"/>
            </h3>
          </div>

          <div className="flex">
            <Button text='View all tokens' size='xs' url="/tokens"/>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mx-auto gap-y-8 mt-2 py-2">
          { f_tokens.map((t, i) => (<ProjectCard key={i} token={t}/>))}
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="h-1 bg-violet-500 w-1/2"/>
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between px-4 py-1'>
          <div className='flex items-center gap-2'>
            <h3 className="text-lg uppercase font-bold tracking-wider text-neutral-300">
              <code>Verified <span className="text-violet-400">Apps</span></code>
              <div className="border-2 border-violet-400 w-full"/>
            </h3>
          </div>

          <div className="flex">
            <Button text='View all apps' size='xs' url="/apps"/>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mx-auto gap-y-8 mt-2 py-2">
          { f_dapps.map((d, i) => (<ProjectCard key={i} dapp={d}/>))}
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="h-1 bg-violet-500 w-1/2"/>
        </div>
      </div>
    </div>

    </div>
  );
};

export default Featured;