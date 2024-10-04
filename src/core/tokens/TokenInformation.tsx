import Button from "@/components/Button";
import LimitedParagraph from "@/components/LimitedParagraph";
import curator from "@/unity/curator";
import token from "@/unity/tokens";
import { title_and_data } from "@/utils/Interfaces";
import { copy_to_clipboard, format_big_number } from "@/utils/StringUtils";
import Link from "next/link";
import { FC } from "react";

interface custom_props {
  token: token;
  statistics: title_and_data[];
}

const TokenInformation: FC <custom_props> = ({ token, statistics }) => {
  const curators = curator.filter(c => token.curated_by.includes(c.id));

  return (
    <div>
      <div className="py-3">
        <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
          <h3>
            {'About '}
            <span className="text-violet-400">
              {token.information.name}
            </span>
          </h3>
          <div className="bg-violet-500 h-1 mb-3"/>
        </div>

        <div className="flex justify-center">
          <div className="h-20 px-4 py-2 text-sm text-neutral-300 break-words text-center overflow-y-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <code>{token.information.description}</code>
          </div>
        </div>

        {token.information.fingerprint && (
          <div className="pt-6 pb-2 flex flex-wrap gap-4 justify-center">
            {token.information.policy_id && statistics.map((item, i) => {

              return (
                <div onClick={() => copy_to_clipboard(item.data.toString())} key={i} className={`cursor-copy border-2 border-neutral-800 bg-neutral-950/50 background-blur rounded-md hover:scale-105 transition-all duration-300 px-4`}>
                  <div>
                    <div className="flex flex-col items-center py-2 md:px-4 rounded-lg">
                      <div className="max-w-45 md:max-w-60 truncate px-1">
                        <code className="text-lg font-bold text-center tracking-wider text-violet-400">{item.data}</code>
                        {i === 0 && (
                          <code className="px-2 text-xs text-neutral-400">{'[' + format_big_number(Number(token.information.supply)) + ']'}</code>
                        )}
                      </div>
                    
                      <div className="text-sm mx-auto tracking-widest">
                        <span className="text-neutral-300">{item.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            )}
          </div>
        )}
      </div>
      <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center mt-10">
        <h3>
          {'Stay in '}
          <span className="text-violet-400">
            Touch
          </span>
        </h3>
        <div className="bg-violet-500 h-1 mb-3"/>
      </div>

      <div>
        
        <div className="my-1 flex gap-2 flex-wrap justify-center">
          { Object.entries(token.links).map(([item, url], i) => (
            url && (
              <Button
                key={i}
                text={item.toUpperCase()}
                size="sm"
                icon={item}
                class_extra="tracking-wider fill-neutral-300"
                bold_type="medium"
                url={url}
                target="_blank"
                social_icon={item}
              />
            )
          ))}
        </div>
      </div>
      
      <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center mt-10">
        <h3>
          {'Page '}
          <span className="text-violet-400">
            Curators
          </span>
        </h3>
        <div className="bg-violet-500 h-1 mb-3"/>
      </div>

      <div>
      <div className="flex flex-wrap gap-2 py-2 justify-center">
                  { curators.map((curator, i) => (
                    <Link key={i} href={'/curators/' + curator.id}>
                      <img src={curator.images.main} className="h-16 w-16 rounded-lg hover:scale-105 transition-all duration-300"/>
                    </Link>
                  ))}
                </div>
      </div>

    </div>
  );
};

export default TokenInformation;