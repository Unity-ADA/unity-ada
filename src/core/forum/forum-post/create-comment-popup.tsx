import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import { error_toast, site_roles, string_rules, toast_strings } from "@/consts/global";
import { AssetExtended } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface custom_props {
  check_for_wallet: () => Promise<void>

  toggle_popup: () => void;
  is_popup_open: boolean;

  comment_text: string;
  set_comment_text: Dispatch<SetStateAction<string>>;

  set_do_comment_post: Dispatch<SetStateAction<boolean>>;

  wallet_handle: string;
  set_wallet_handle: Dispatch<SetStateAction<string>>;

  connected_address: string;
}

const CommentPostPopup: FC <custom_props> =  ({
  check_for_wallet,
  toggle_popup, is_popup_open,
  comment_text, set_comment_text,
  set_do_comment_post,
  wallet_handle, set_wallet_handle,
  connected_address
}) => {
  const [show_preview, set_show_preview] = useState(false);
  const [users_handles, set_users_handles] = useState<AssetExtended[]>();

  const toggle_preview = () => {
    set_show_preview(!show_preview);
  }

  const check_post = (): boolean => {
    if (!comment_text || comment_text.length < string_rules.MIN_CHARS || comment_text.length > string_rules.MAX_CHARS_COMMENTS) {
      error_toast('Incorrect comment length!');
      return false;
    } else {
      return true;
    }
  }

  const do_create_comment = () => {
    const checked_passed = check_post();
    if (checked_passed) {
      set_do_comment_post(true);
    } else {
      error_toast('Failed creation check!');
    }
  }

  const use_wallet = useWallet();
  const is_connected = use_wallet.connected;
  const wallet = use_wallet.wallet;

  const get_users_handles = async () => {
    if (is_connected) {
      const assets = await wallet.getAssets();
      if (assets) {
        const ada_handles = assets.filter(handle =>
          handle.policyId.includes('f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a')
        );
        set_users_handles(ada_handles);
      } else {
        set_users_handles(undefined);
      }
    }
  };

  const users_picked_handle = (handle_name: string) => {
    set_wallet_handle(handle_name);
  }

  const users_removed_handle = () => {
    set_wallet_handle('');
  }

  const apply_fake_handle = () => {
    set_wallet_handle('fakeadahandle');
  }

  useEffect(() => {
    check_for_wallet();
    get_users_handles();
    if (!is_connected && is_popup_open) {
      toggle_popup();
      error_toast(toast_strings.failed_wallet);
    }
  }, [is_connected]);


  return ( 
    is_popup_open && (
      <div className="fixed inset-0 bg-neutral-950 bg-opacity-70 flex justify-center items-center z-10 transition-all duration-300">
        <div className="mx-4 bg-neutral-900 border-2 border-neutral-800 px-4 py-2 rounded-lg flex flex-col gap-2 md:w-1/2 px-4">
          <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
            <h3>
              {'Comment on this '}
              <span className="text-violet-400">
                Post
              </span>
            </h3>
          </div>

          { site_roles.admin.granted_to.includes(connected_address) &&
            <div>
              <code className="text-sm">Mod Tools</code>
              <div className="flex flex-wrap gap-2">
                <div onClick={wallet_handle == "" ? apply_fake_handle : undefined}>
                  <Button text={wallet_handle == "" ? 'Apply Fake Handle' : 'Handle Applied'} size="xs"/>
                </div>
              </div>
            </div>
          }

          <div>
              <div className='block py-2'>
                <code className='text-xs'>Comment: {comment_text.length + "/" + string_rules.MAX_CHARS_COMMENTS}</code>
                <textarea
                  className="min-h-10 max-h-100 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                  value={comment_text}
                  onChange={(e) => set_comment_text(e.target.value)}
                />
              </div>

              <div className={`block ${show_preview == true ? "min-h-20" : "hidden"}`}>
                <UnityMD>
                  {comment_text}
                </UnityMD>
              </div>
              

            {users_handles && users_handles.length != 0 && (
              <div>
                { wallet_handle == "" ?
                  <div>
                    <div>
                      <code className='text-xs'>Ada Handles Found:</code>
                    </div>
  
                  <div className='flex gap-2 flex-wrap py-2'>
                    {users_handles.map((h, i) => {
                      const ada_handle_name = "$" + Buffer.from(h.assetName, 'hex').toString('utf8');
                      return (
                        <div key={i} onClick={() => users_picked_handle(ada_handle_name)}>
                          <Button key={i} text={ada_handle_name} size='xs' class_extra='text-lime-400 cursor-pointer'/>
                        </div>
                      )}
                    )}
                  </div>
                  </div>
                  :
                  <div>
                    <div>
                      <code className='text-xs'>Wallet Handle Chosen:</code>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <div onClick={users_removed_handle}>
                        <Button icon='x_solid' size='xs' class_extra='cursor-pointer fill-rose-400'/>
                      </div>
                      <Button text={wallet_handle} size='xs' class_extra='text-lime-400 cursor-default'/>
                    </div>
                  </div>
                }
              </div>
            )}

          </div>

          <div className="flex justify-center gap-2">
            <div onClick={toggle_popup}>
              <Button text="Close Popup" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={toggle_preview}>
              <Button text="Toggle Preview" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={do_create_comment}>
              <Button text={"Create Comment"} size="xs" class_extra="cursor-pointer"/>
            </div>
          </div>

        </div>
    </div>
  ))
}

export default CommentPostPopup;