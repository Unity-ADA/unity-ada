
import React, { FC }  from "react";
import dynamic from "next/dynamic";

import '@dexhunterio/swaps/lib/assets/style.css'
import token from "@/unity/tokens";

const Swap = dynamic(() => import("@dexhunterio/swaps"), {
  ssr: false,
});

interface BuyTokenProps {
  token: token;
}

const BuyToken: FC<BuyTokenProps> = ({ token }) => {
  const full_policy = token.information.policy_id_full as string;
  let policy_to_use = full_policy;

  if (!token || policy_to_use.length == 0) {
    return null;
  }

  /** @note should only be empty, after checks, when on dexhunter token */
  switch (token.slug) {
    case 'hunt':
      policy_to_use = "";
      break;
    default:
      break;
  }

  return (
    <div className="">
    <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
      <h3>
        {'Buy '}
        <span className="text-violet-400">
          {'[$' + token.information.ticker + ']'}
        </span>
      </h3>
      <div className="bg-violet-500 h-1 mb-3"/>
    </div>


      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center">
        <div className="">
          <Swap
            orderTypes={["SWAP","LIMIT","DCA"]}
            defaultToken={policy_to_use}
            colors={{"background":"#0a0a0a","containers":"#262626","subText":"#a78bfa","mainText":"#e5e5e5","buttonText":"#0a0a0a","accent":"#a78bfa"}}
            theme="dark"
            partnerCode="unity6164647231717833386e74637a6d6c6b646e79716d3738616365663739306a7271723965686a79737932357472727876686165383964363239306e637a6e30793479637961736c613238737171727470797476337675753075716a34797533377139327275646cda39a3ee5e6b4b0d3255bfef95601890afd80709"
            partnerName="Unity"
            displayType="DEFAULT"
            style={{ maxWidth: '85%', margin: '0 auto' }}
          />
          </div>
          <div className="flex flex-col flex-start items-center my-auto gap-4">
          
            <div className="border-2 rounded-md border-neutral-800 bg-neutral-950/50 background-blur px-2 py-1 text-center break-words max-w-70 flex mx-auto flex-col gap-2">
              <h3 className="text-sm text-neutral-400">
                When buying or selling within Unity, there is a 0.2% added fee to help support the platform.
              </h3>
              <code className={`text-sm text-violet-400 font-bold`}>
                Every 1 ADA spent is 0.002 as fee
              </code>
            </div>

          <div className="hidden md:block border-2 rounded-md border-neutral-800 bg-neutral-950/50 background-blur px-2 py-1 text-center break-words max-w-70 flex mx-auto flex-col gap-2">
            <h3 className="text-sm text-neutral-400">
              DexHunter Keyboard Shortcuts
            </h3>
            <div className="flex flex-col gap-2 py-2">
              <div className="flex justify-center items-center gap-2">
                <kbd className="px-2 py-0.5 text-xs font-semibold border rounded-lg text-violet-400 border-neutral-600">Q</kbd>
                <h3 className={`text-sm text-neutral-950`}><code className="px-2 bg-violet-400">- 1% Slippage</code></h3>
              </div>
              <div className="flex justify-center items-center gap-2">
                <kbd className="px-2 py-0.5 text-xs font-semibold border rounded-lg text-violet-400 border-neutral-600">E</kbd>
                <h3 className={`text-sm text-neutral-950`}><code className="px-2 bg-violet-400">+ 1% Slippage</code></h3>
              </div>
              <div className="flex justify-center items-center gap-2">
                <kbd className="px-2 py-0.5 text-xs font-semibold border rounded-lg text-violet-400 border-neutral-600">K</kbd>
                <h3 className={`text-sm text-neutral-950`}><code className="px-2 bg-violet-400">Swap Buy/Sell</code></h3>
              </div>
              <div className="flex justify-center items-center gap-2">
                <kbd className="px-2 py-0.5 text-xs font-semibold border rounded-lg text-violet-400 border-neutral-600">P</kbd>
                <h3 className={`text-sm text-neutral-950`}><code className="px-2 bg-violet-400">Swap Price</code></h3>
              </div>
              <div className="flex justify-center items-center gap-2">
                <kbd className="px-2 py-0.5 text-xs font-semibold border rounded-lg text-violet-400 border-neutral-600">S</kbd>
                <h3 className={`text-sm text-neutral-950`}><code className="px-2 bg-violet-400">Settings</code></h3>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default BuyToken;