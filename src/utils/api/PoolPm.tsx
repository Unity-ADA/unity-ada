
export interface Total {
  ADAUSD: number;
  ADAEUR: number;
  ADAJPY: number;
  ADAGBP: number;
  ADACAD: number;
  ADAAUD: number;
  ADABRL: number;
  circulation: number;
  delegations: number;
  k: number;
  load_5m: number;
  load_1h: number;
  load_24h: number;
  nft_policies: number;
  nfts: number;
  policies: number;
  stake: number;
  supply: number;
  tokens: number;
}

export async function Total(): Promise<Total | null> {
  try {
    const response = await fetch('https://pool.pm/total.json');

    if (!response.ok) {
      console.error(`[API] Fetch error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data: Total = await response.json();

    return data;
  } catch (error) {
    console.error('[API] Could not obtain Total', error);
    return null;
  }
}

export interface AssetFingerprint {
  decimals: number;
  epoch: number;
  fingerprint: string;
  ftks: string[];
  label: number;
  metadata?: {
    description?: string;
    minting?: {
      blockchain?: string;
      mintedBeforeSlotNumber?: number;
      type?: string;
    };
    name?: string;
    symbol?: string;
    totalSupply?: string;
  };
  mint: number;
  name: string;
  owner: string;
  policy: string;
  quantity: number;
  tk: string;
}

export async function AssetFingerprint(asset_fingerprint: string): Promise<AssetFingerprint | null> {
  try {
    const response = await fetch(`https://pool.pm/asset/${asset_fingerprint}?preview=true`);

    if (!response.ok) {
      console.error(`[API] Fetch error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data: AssetFingerprint = await response.json();

    return data;
  } catch (error) {
    console.error('[API] Could not obtain AssetFingerprint', error);
    return null;
  }
}

export interface StakersData {
  address: string;
  amount: number;
  reward: number;
  epoch: number;
  time: number;
}

export interface PoolData {
  name: string;
  isActive: boolean;
  ticker: string;
  website?: string;
  delegators_no: number;
  stake_total: any;
  retired?: number;
  stakers: StakersData[];
}

export async function PoolData(pool_id: string): Promise<PoolData | null> {
  interface pools_res {
    addr: string;
    name: string;
    ticker: string;
    homepage?: string;
    retired?: number;
  }

  interface stake_res {
    amount: number;
    reward: number;
    epoch: number;
    time: number;
  }  

  try {
    const all_pools = await fetch('https://pool.pm/pools.json');
    if (!all_pools.ok) {
      console.error(`[API] Fetch error: ${all_pools.status} - ${all_pools.statusText}`);
      return null;
    }

    const all_pools_data: { [key: string]: pools_res } = await all_pools.json();

    const pool_entry = Object.entries(all_pools_data).find(([key, pool]) => pool.addr === pool_id);
    if (!pool_entry) {
      console.error(`Couldn't find pool`);
      return null;
    }

    const [pool_hash, pool_data] = pool_entry;

    const pool_stake = await fetch(`https://pool.pm/stake/${pool_hash}`)
    if (!pool_stake.ok) {
      console.error(`[API] Fetch error: ${pool_stake.status} - ${pool_stake.statusText}`);
      return null;
    }

    const pool_stake_data: { [key: string]: stake_res } = await pool_stake.json();

    const formatted: PoolData = {
      name: pool_data.name,
      ticker: pool_data.ticker,
      website: pool_data.homepage || "",
      isActive: !pool_data.retired,
      delegators_no: Object.keys(pool_stake_data).length,
      stake_total: Object.values(pool_stake_data).reduce((a, b) => a + b.amount, 0),
      retired: pool_data.retired,
      stakers: Object.entries(pool_stake_data).map(([address, value]) => ({ address, ...value }))
    }

    return formatted;
  } catch (error) {
    console.error('[API] Could not obtain PoolData', error);
    return null;
  }
}