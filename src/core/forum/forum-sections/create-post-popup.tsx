import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import { error_toast, site_roles, string_rules, success_toast, toast_strings, toast_theme } from "@/consts/global";
import { forum_post } from "@/utils/Interfaces";
import { AssetExtended } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface custom_props {
  toggle_popup: () => void;
  is_popup_open: boolean;

  title_text: string;
  set_title_text: Dispatch<SetStateAction<string>>;

  tag_text: string;
  set_tag_text: Dispatch<SetStateAction<string>>;

  post_text: string;
  set_post_text: Dispatch<SetStateAction<string>>;

  wallet_handle: string;
  set_wallet_handle: Dispatch<SetStateAction<string>>;

  set_do_create_post: Dispatch<SetStateAction<boolean>>;
}

const CreatePostPopup: FC <custom_props> =  ({
  toggle_popup, is_popup_open,
  tag_text, set_tag_text,
  post_text, set_post_text,
  title_text, set_title_text,
  wallet_handle, set_wallet_handle,
  set_do_create_post
}) => {
  const [show_preview, set_show_preview] = useState(false);
  const [users_handles, set_users_handles] = useState<AssetExtended[]>();
  const [connected_address, set_connected_address] = useState<string>();
  const use_wallet = useWallet();
  const is_connected = use_wallet.connected;
  const wallet = use_wallet.wallet;

  const toggle_preview = () => {
    set_show_preview(!show_preview);
  }

  const check_post = (): boolean => {
    if (!post_text || post_text.length < string_rules.MIN_CHARS || post_text.length > string_rules.MAX_CHARS_POST) {
      error_toast('Incorrect post length!');
      return false;
    } else if (!title_text || title_text.length < string_rules.MIN_CHARS || title_text.length > string_rules.MAX_CHARS_TITLE) {
      error_toast('Incorrect title length!');
      return false;
    } else if (tag_text && (tag_text.length < string_rules.MIN_CHARS || tag_text.length > string_rules.MAX_CHARS_TAG || tag_text.startsWith('#'))) {
      if (tag_text.startsWith('#')) {
        error_toast('Tag starts with #');
        return false;
      } else {
        error_toast('Incorrect tag length!');
        return false;
      }
    } else {
      return true;
    }
  }

  const do_create_post = () => {
    if (is_connected && connected_address) {
      if (site_roles.admin.granted_to.includes(connected_address)) {
        set_do_create_post(true);
        success_toast('Admin found, no need to check post');
      } else {
        const checked_passed = check_post();
        if (checked_passed) {
          set_do_create_post(true);
        } else {
          error_toast('Failed creation check!');
        }
      }
    }
  }

  const users_picked_handle = (handle_name: string) => {
    set_wallet_handle(handle_name);
  }

  const users_removed_handle = () => {
    set_wallet_handle('');
  }

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

  const check_for_wallet = async () => {
    if (is_connected) {
      const addr = (await wallet.getChangeAddress()).toString();
      set_connected_address(addr);
    } else {
      set_connected_address(undefined);
    }
  }

  useEffect(() => {
    check_for_wallet();
    get_users_handles();
    if (!is_connected && is_popup_open) {
      toggle_popup();
      error_toast(toast_strings.failed_wallet);
    }
  }, [is_connected]);

  useEffect(() => {
    set_wallet_handle(wallet_handle);
  }, [wallet_handle]);

  const apply_fake_handle = () => {
    set_wallet_handle('fakeadahandle');
  }

  return (
    is_popup_open && (
      <div className="fixed inset-0 bg-neutral-950 bg-opacity-70 flex justify-center items-center z-10 transition-all duration-300">
        <div className="mx-4 bg-neutral-900 border-2 border-neutral-800 px-4 py-2 rounded-lg flex flex-col gap-2 md:w-1/2 px-4">
          
          <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
            <h3>
              {'Create your '}
              <span className="text-violet-400">
                Post
              </span>
            </h3>
          </div>

          <div>
            <div>
              <div className='block py-2'>
                <code className='text-xs'>Tag: {tag_text.length + "/" + string_rules.MAX_CHARS_TAG + ' - Dont use a hashtag! Can be left blank.'}</code>
                <input
                  className="w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                  value={tag_text}
                  onChange={(e) => set_tag_text(e.target.value)}
                />
              </div>

              <div className='block py-2'>
                <code className='text-xs'>Title: {title_text.length + "/" + string_rules.MAX_CHARS_TITLE}</code>
                <input
                  className="w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                  value={title_text}
                  onChange={(e) => set_title_text(e.target.value)}
                />
              </div>
              <div className='block py-2'>
                <code className='text-xs'>Post: {post_text.length + "/" + string_rules.MAX_CHARS_POST}</code>
                <textarea
                  className="min-h-10 max-h-100 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                  value={post_text}
                  onChange={(e) => set_post_text(e.target.value)}
                />
              </div>

              <div className={`block ${show_preview == true ? "min-h-20" : "hidden"}`}>
                <UnityMD>
                  {post_text}
                </UnityMD>
              </div>
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

            <div className='flex flex-wrap gap-2 justify-center my-6'>
              {site_roles.admin.granted_to.includes(connected_address as string) && (
                <div onClick={apply_fake_handle}>
                  <Button icon="ada_handle" text="Apply Fake AdaHandle" size="xs" class_extra="cursor-pointer"/>
                </div>
              )}

              <div onClick={toggle_popup}>
                <Button text="Close Popup" size="xs" class_extra="cursor-pointer"/>
              </div>

              <div className="bg-neutral-800 w-0.5"/>

              <div onClick={toggle_preview}>
                <Button text={`${!show_preview ? "Show Preview" : "Back to Edit"}`} size='xs' class_extra='cursor-pointer'/>
              </div>

              <div className="md:bg-neutral-800 md:w-0.5"/>

              <div onClick={do_create_post}>
                <Button text="Create Post" size="xs" class_extra="cursor-pointer"/>
              </div>

            </div>
          </div>
        </div>

      </div>
    )
  );
}

export default CreatePostPopup;