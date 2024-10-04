import React, { useEffect, useState } from "react";
import { BrowserWallet, Wallet } from "@meshsdk/core";
import { useWallet, WalletContext } from "@meshsdk/react";
import Button from "@/components/Button";
import { copy_to_clipboard } from "@/utils/StringUtils";

const ConnectWallet = ({ }: any) => {
  const wallet = useWallet();

  const [installed_wallets, set_installed_wallets] = useState<Wallet[]>([]);
  const [show_wallets, set_show_wallet] = useState(false);
  const [loggedin_wallet, set_loggedin_wallet] = useState('');

  const get_installed_wallets = async () => {
    const wallet_list = await BrowserWallet.getAvailableWallets();
    set_installed_wallets(wallet_list);
  }

  useEffect(() => {
    get_installed_wallets();
  }, []);
  
  useEffect(() => {
    if (wallet.connected) {
      get_wallet_address();
    }
  }, [wallet.connected]);

  const toggle_wallet = () => {
    set_show_wallet(!show_wallets);
  }

  const toggle_choosen_wallet = async (w: Wallet) => {
    await wallet.connect(w.name);
    const i = await BrowserWallet.enable(w.name);
    const get_addr = (await (i).getChangeAddress()).toString();
    set_loggedin_wallet(get_addr);
  }

  const toggle_disconnect_wallet = () => {
    wallet.disconnect();
    set_loggedin_wallet('');
    toggle_wallet();
  }

  /** @note we should already be connected by this point */
  const get_wallet_address = async () => {
    const addr = (await wallet.wallet.getChangeAddress()).toString();
    set_loggedin_wallet(addr);
  }

  return (
    <>
    { !wallet.connected ?
      <div className="px-2 m-2">
        <div>
          { !show_wallets ?
            <div className="flex justify-center" onClick={toggle_wallet}>
              <Button text={'Connect Wallet'} size="xs" class_extra="cursor-pointer"/>
            </div>
            :
            <div className="flex flex-col justify-center gap-2">
              {installed_wallets.filter(w => w.name !== "MetaMask").map((w, i) => (
                <div key={i} onClick={() => toggle_choosen_wallet(w)}>
                  <Button img={w.icon} text={w.name} size="xs"class_extra="cursor-pointer"/>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    :
      <div className="px-2 m-2">
        <div className="flex flex-col gap-2 justify-center">
          <div onClick={() => copy_to_clipboard(loggedin_wallet)}>
            <Button icon="wallet_solid" text={loggedin_wallet} size="xs" max_w="max-w-40" class_extra="fill-blue-400/70 cursor-copy"/>
          </div>

          <div onClick={toggle_disconnect_wallet}>
            <Button icon="logout_solid" text={'Disconnect'} size="xs" class_extra="fill-rose-600 cursor-pointer"/>
          </div>
        </div>
      </div>
    }
    </>
  );
};

export default ConnectWallet;