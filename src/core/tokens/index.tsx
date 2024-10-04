
import { FC, useEffect, useState } from "react";

import BuyToken from "./BuyToken";
import TokenInformation from "./TokenInformation";
import UserSocialInteraction from "./UserSocialInteraction";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { AssetFingerprint } from "@/utils/api/PoolPm";
import { title_and_data } from "@/utils/Interfaces";
import { format_atomic, format_unix_time } from "@/utils/StringUtils";

import token from "@/unity/tokens";

const TokenIndex: FC<{ token_info: token }> = ({ token_info }) => {
  const fingerprint = token_info.information.fingerprint;
  const [active_tab, set_active_tab] = useState(0);

  const [dataState, setDataState] = useState<AssetFingerprint>({
    decimals: 0, epoch: 0, fingerprint: '', ftks: [],
    label: 0, metadata: {}, mint: 0, name: '',
    owner: '', policy: '', quantity: 0, tk: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fingerprint) {
          const data: any = await AssetFingerprint(fingerprint);
          setDataState(data);
        }
      } catch (e) {
        console.error('[/index.tsx] - An error occurred while fetching AssetFingerprint: ', e);
      }
    };

    fetchData().catch((e) => {
      console.error('[/index.tsx] - An error occurred with fetchData: ', e);
    });
  }, [fingerprint]);

  function useAtomic(slug_ref: string) {
    const tokens_to_atmoic = [
      "usdm", "minswap", "mom"
    ];

    if (tokens_to_atmoic.includes(slug_ref)) {
      return format_atomic(dataState.decimals, dataState.quantity);
    }
    return dataState.quantity;
  }

  const statistics: title_and_data[] = [
    {
      title: "Total Supply",
      data: useAtomic(token_info.slug).toLocaleString(undefined, { maximumFractionDigits: 0 })
    },
    {
      title: "Decimals",
      data: token_info.information.decimals
    },
    {
      title: "Fingerprint",
      data: token_info.information.fingerprint
    },
    {
      title: "Policy ID",
      data: token_info.information.policy_id
    },
    {
      title: "Policy ID (Full)",
      data: token_info.information.policy_id_full
    },
    {
      title: "Date Minted",
      data: format_unix_time(dataState.mint)
    },
    {
      title: "Minters Address",
      data: dataState.owner
    },
  ];

  const handle_change_tab = (index: number) => {
    set_active_tab(index);
  }

  return (
    <div>
      <Breadcrumb sub_page_1="Tokens" active_page={token_info.slug}/>

      <div className="py-4 px-2">
        <Header token={token_info}/>

        <div>
          <div className="grid grid-cols-1 grid-rows-1 gap-4">

            <div className="px-4 flex flex-col order-first sm:order-none ml-5">
              <div className="md:mt-20 py-10">
                <div className="flex flex-wrap gap-2 justify-center">
                  <div onClick={() => handle_change_tab(0)}>
                    <Button icon="info_solid" text="View Information" size="sm" class_extra="fill-neutral-300 cursor-pointer"/>
                  </div>
                  <div onClick={() => handle_change_tab(1)}>
                    <Button icon="heart_solid" text={"Interact with $" + token_info.information.ticker} size="sm" class_extra="fill-rose-600 cursor-pointer"/>
                  </div>
                  {token_info.information.policy_id_full && (
                    <div onClick={() => handle_change_tab(2)}>
                      <Button icon="money_solid" text={"Buy $" + token_info.information.ticker} size="sm" class_extra="fill-green-600 cursor-pointer"/>
                    </div>
                  )}
                </div>
              </div>

              { active_tab === 0 && (
                <TokenInformation token={token_info} statistics={statistics}/>
              )}
              { active_tab === 1 && (
                <UserSocialInteraction token={token_info}/>
              )}
              { active_tab === 2 && token_info.information.policy_id_full &&
                <div className="py-4">
                  <BuyToken token={token_info}/>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenIndex;
