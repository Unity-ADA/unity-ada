import { FC, useEffect, useState } from "react";
import { title_and_data } from "@/utils/Interfaces";
import Chip from "@/components/Chip";
import { Total } from "@/utils/api/PoolPm";
import { ADA_ATOMIC_UNIT } from "@/consts/global";

const Stats: FC = () => {
  const [totalData, setTotalData] = useState<Total | null>(null);

  const fetchData = async () => {
    try {
      const data = await Total();
      setTotalData(data);
    } catch (e) {
      console.error('[/Stats.tsx] - An error occurred while fetching Total(): ', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const NA = "N/A";
  const has_data = totalData != null;

  const cardano_stats: title_and_data[] = [
    {
      title: "Price",
      data: has_data ? `£${totalData.ADAGBP}` : NA
    },
    {
      title: "Marketcap",
      data: has_data ? `£${((totalData.ADAGBP * totalData.supply) / ADA_ATOMIC_UNIT).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : NA
    },
    {
      title: "Delegated Wallets",
      data: has_data ? `${(totalData.delegations).toLocaleString()}` : NA
    },
    {
      title: "Circulating Supply",
      data: has_data ? `${((totalData.supply) / ADA_ATOMIC_UNIT).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : NA
    },
    {
      title: "Staked",
      data: has_data ? `${((totalData.stake) / ADA_ATOMIC_UNIT).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : NA
    },
    {
      title: "Total Supply",
      data: (45000000000).toLocaleString(undefined, { maximumFractionDigits: 0 })
    },
    {
      title: "Token Policies",
      data: has_data ? `${(totalData.policies).toLocaleString()}` : NA
    },
    {
      title: "cNFT Policies",
      data: has_data ? `${(totalData.nft_policies).toLocaleString()}` : NA
    },
  ];

  return (
    <div className='flex flex-col my-10 subgrid gap-2 flex-wrap md:mx-30'>
      <div className="flex py-2 gap-2 justify-center flex-wrap subgrid">
        {cardano_stats.map((item, index) => {
          return (
            <div key={index} className="flex">
              <Chip icon='ada_logo' text={item.title + ": " + item.data} size="xs"/>
            </div>
          )}
        )}
      </div>
    </div>
  );
};

export default Stats;