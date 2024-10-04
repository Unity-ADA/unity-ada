import Button from "@/components/Button";
import LimitedParagraph from "@/components/LimitedParagraph";
import curator from "@/unity/curator";
import dapp from "@/unity/dapp";
import pool from "@/unity/pool";
import token from "@/unity/tokens";
import { FC } from "react";

interface custom_props {
  token?: token;
  pool?: pool;
  curator?: curator;
  dapp?: dapp;
}

const ProjectCard: FC <custom_props> = ({ token, pool, curator, dapp }) => {
  let project_img         = "";
  let project_slug        = "";
  let project_title       = "";
  let project_ticker      = "";
  let project_description = "";
  let project_category    = "";
  let project_url         = "";
  let type                = "";
  let project_links       = {};
  let chip_colour         = "";

  if (token) {
    project_img         = token.images.main;
    project_slug        = token.slug;
    project_title       = token.information.name;
    project_ticker      = token.information.ticker;
    project_description = token.information.description;
    project_category    = token.category;
    project_url         = "/tokens/" + token.slug;
    project_links       = token.links;
    type                = "Token";
    chip_colour         = "bg-sky-500/20 text-sky-300/90";
  } else if (pool) {
    project_img         = pool.images.main;
    project_slug        = pool.slug;
    project_title       = pool.information.name;
    project_ticker      = pool.information.ticker;
    project_url         = "/pools/" + pool.slug;
    project_links       = pool.links;
    type                = "Pool";
    chip_colour         = "bg-amber-500/20 text-amber-300/90";
  } else if (curator) {
    /** @todo */
  } else if (dapp) {
    project_img         = dapp.image;
    project_title       = dapp.name;
    project_description = dapp.description;
    project_category    = dapp.category;
    project_links       = dapp.links;
    type                = "App";
    chip_colour         = "bg-emerald-500/20 text-emerald-300/90";
  }

  const integrated_into_unity = [
    "DexHunter",
  ]
  const is_integrated = integrated_into_unity.includes(project_title);

  return (
    <div className="md:hover:scale-105 w-80 h-auto bg-neutral-950/50 background-blur border-2 border-neutral-900 rounded-md overflow-hidden relative transition-all duration-300">
      <div className="p-4 relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-xl mr-3">
            <img src={project_img} className="rounded-xl"/>
          </div>

          <div className="h-20">
            <h2 className="text-lg font-bold text-neutral-200 truncate">
              {project_title}
            </h2>
            <div className="flex flex-wrap gap-2 mt-0.5">
              <span className={`${chip_colour} cursor-default text-xs font-medium px-2 py-0.5 rounded-full inline-block uppercase`}>
                <code>{type}</code>
              </span>

              {(token || pool) && (
                <span className="cursor-default text-xs font-medium px-2 py-0.5 rounded-full inline-block bg-violet-500/20 text-violet-300/90">
                  <code>{'$' + project_ticker}</code>
                </span>
              )}

              {(token || dapp) && (
                <span className="bg-slate-500/20 text-slate-300/90 cursor-default text-xs font-medium px-2 py-0.5 rounded-full inline-block uppercase">
                  <code>{project_category}</code>
                </span>
              )}

              {is_integrated && (
                <span className="bg-yellow-500/20 text-yellow-300/90 fill-yellow-300/90 cursor-default text-xs font-medium px-2 py-0.5 rounded-full inline-block uppercase">
                  <code>{'Unity Integrated'}</code>
                </span>
              )}

            </div>
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-xs font-semibold text-neutral-400 mb-2">Social</h3>

          <div className="flex flex-wrap -mx-1 gap-2">
            { Object.entries(project_links).map((t, i) => (<Button key={i} social_icon={t[0]} size="xs" class_extra="fill-neutral-300" url={t[1] as string} target="_blank"/>))}
          </div>
        </div>

        {(token || dapp || curator) && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-neutral-400 mb-2">Description</h3>
              <div className='my-2 rounded-md border-2 border-neutral-900 bg-neutral-950/20 px-2'>
                <div className="h-25 px-4 py-2 text-sm text-neutral-300 break-words text-center overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
                  <code>{project_description}</code>
                </div>
              </div>
          </div>
        )}

        <div className="">
          { dapp ?
            <Button text='Website' size="xs" url={dapp.links.website} target="_blank"/>
            :
            <Button text={'Explore'} size="xs" url={project_url}/>
          }
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;