import { forum_check_valid_post } from '@/utils/StringUtils';
import { useWallet } from '@meshsdk/react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Button from './Button';
import { string_rules } from '@/consts/global';
import ToolTip from './Tooltip';
import UnityMD from './UnityMD';
import { AssetExtended } from '@meshsdk/core';
import { project_comment } from '@/utils/Interfaces';
import toast from 'react-hot-toast';

interface custom_props {
  toggle_popup: () => void;
  is_popup_open: boolean;
  is_edit: boolean;

  set_wallet_handle: Dispatch<SetStateAction<string>>;

  comment?: {
    comment_text: string;
    set_comment_text: Dispatch<SetStateAction<string>>;
    project_comment_to_edit?: project_comment;
  }

  post?: {
    title_text: string;
    set_title_text: Dispatch<SetStateAction<string>>;
  
    tag_text: string;
    set_tag_text: Dispatch<SetStateAction<string>>;
  
    post_text: string;
    set_post_text: Dispatch<SetStateAction<string>>;
  }

  on_finished: {
    handle_create_comment: () => Promise<null | undefined>;
    handle_edit_comment: () => Promise<null | undefined>;
  }
}

const CreatePopup: FC <custom_props> = ({
  toggle_popup,
  is_popup_open,
  is_edit,
  set_wallet_handle,
  comment,
  post,
  on_finished
}) => {
  const wallet = useWallet();
  const is_connected = wallet.connected;
  const [is_valid, set_is_valid] = useState(false);
  const [show_preview, set_show_preview] = useState(false);
  const [use_handle_popup, set_use_handle_popup] = useState(false);
  const [users_handles, set_users_handles] = useState<AssetExtended[]>();

  const [wallet_handle_chosen, set_wallet_handle_chosen] = useState('');

  const toggle_preview = () => {
    set_show_preview(!show_preview);
  }

  const users_picked_handle = (handle_name: string) => {
    set_wallet_handle_chosen(handle_name);
  }

  const users_removed_handle = () => {
    set_wallet_handle_chosen('');
  }

  const get_users_handles = async () => {
    if (is_connected) {
      const wallet_handles = await wallet.wallet.getAssets();
      if (wallet_handles) {
        const filtered_handles = wallet_handles.filter(handle =>
          handle.policyId.includes('f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a')
        );
        set_users_handles(filtered_handles);
      } else {
        set_users_handles(undefined);
      }
    }
  };

  useEffect(() => {
    if (comment && comment.comment_text && comment.comment_text.length !== 0) {
      set_is_valid(forum_check_valid_post(undefined, undefined, comment.comment_text));
    } else {
      set_is_valid(false);
    }
  }, [comment && comment.comment_text]);

  useEffect(() => {
    if (post && post.title_text.length !== 0 && post.post_text.length !== 0) {
      set_is_valid(forum_check_valid_post(post.title_text, post.post_text, undefined, post.tag_text));
    } else {
      set_is_valid(false);
    }
  }, [post && (post.title_text, post.post_text, post.tag_text)]);

  useEffect(() => {
    get_users_handles()
  }, [is_connected]);

  useEffect(() => {
    set_wallet_handle(wallet_handle_chosen);
  }, [wallet_handle_chosen]);

  function handle_on_finished() {
    if (comment) {
      if (is_edit) {
        on_finished.handle_edit_comment();
      } else if (!is_edit) {
        on_finished.handle_create_comment();
      }
    }
  };

  return (
    <>
      {is_popup_open && (
        <div className="fixed inset-0 bg-neutral-950 bg-opacity-70 flex justify-center items-center z-10 transition-all duration-300">
          <div className="mx-4 bg-neutral-900 border-2 border-neutral-800 px-4 py-2 rounded-lg flex flex-col gap-2">
            <h3 className='font-bold tracking-wider text-center text-neutral-300'>
              Create your
              <span className='text-violet-400 tracking-wider'>
                {comment ? " comment" : " post"}
              </span>
            </h3>

            <code className='text-center text-xs md:px-10'>
              <i>Limited markdown</i> and <i>:unity_emojis:</i> supported in {comment ? " comments." : " posts."}
            </code>

            <div>
              <form className="flex flex-col gap-4 mt-4">
                { comment && (
                  <>
                    <div className='block'>
                      <code className='text-xs'>{comment.comment_text.length + "/" + string_rules.MAX_CHARS_COMMENTS}</code>
                      <textarea
                        placeholder="Write your comment..."
                        className="min-h-20 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                        value={comment.comment_text}
                        onChange={(e) => comment.set_comment_text(e.target.value)}
                      />
                    </div>

                    <div className={`block ${show_preview == true ? "min-h-20" : "hidden"}`}>
                      <UnityMD>
                        {comment.comment_text}
                      </UnityMD>
                    </div>
                  </>
                )}

                {post && (
                  <>
                    <div className='block'>
                      <code className='text-xs'>{post.tag_text.length + "/" + string_rules.MAX_CHARS_TAG + ' - Dont use a hashtag! Can be left blank.'}</code>

                      <input
                        placeholder="Write a #tag..."
                        className="w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                        value={post.tag_text}
                        onChange={(e) => post.set_tag_text(e.target.value)}
                      />
                    </div>

                    <div className='block'>
                      <code className='text-xs'>{post.title_text.length + "/" + string_rules.MAX_CHARS_TITLE}</code>
                      <input
                        placeholder="Write a title..."
                        className="w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                        value={post.title_text}
                        onChange={(e) => post.set_title_text(e.target.value)}
                      />
                    </div>

                <div className={`block ${show_preview ? "hidden" : ""}`}>
                  <code className='text-xs'>{post.post_text.length + "/600"}</code>
                  <textarea
                    placeholder="[*] Write your post..."
                    className="min-h-20 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                    value={post.post_text}
                    onChange={(e) => post.set_post_text(e.target.value)}
                  />
                </div>
                
                <div className={`block ${show_preview == true ? "min-h-20" : "hidden"}`}>
                  <UnityMD>
                    {post.post_text}
                  </UnityMD>
                </div>

                  </>
                )}

                <div className='flex flex-row justify-center' onClick={toggle_preview}>
                  <Button text={`${!show_preview ? "Show Preview" : "Hide Preview"}`} size='xs' class_extra='cursor-pointer'/>
                </div>
              </form>
            </div>

            {users_handles && users_handles.length != 0 && (
              <div>
                { wallet_handle_chosen == "" ?
                  <div>
                    <div>
                      <h3 className='text-neutral-300'>
                        We found $adahandles in your wallet!
                      </h3>
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
                      Adahandle Chosen:
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <div onClick={users_removed_handle}>
                        <Button icon='x_solid' size='xs' class_extra='cursor-pointer fill-rose-400'/>
                      </div>
                      <Button text={wallet_handle_chosen} size='xs' class_extra='text-lime-400 cursor-default'/>
                    </div>
                  </div>
                }
              </div>
            )}

            <div className='-mb-5 pt-2 flex flex-row gap-2 justify-center'>
              <div onClick={toggle_popup}>
                <Button text='Close Popup' size='xs' class_extra='cursor-pointer'/>
              </div>

              { (is_valid && is_connected) ?
                <div className='transition-all duration-300' onClick={handle_on_finished}>
                  <Button text={'Submit ' + (comment ? "Comment" : "Post")} size='xs' class_extra={`cursor-pointer`}/>
                </div>
                :
                <div className='transition-all duration-300'>
                  { !is_connected ? 
                    <ToolTip text='[Error]: Wallet isnt connected!'>
                      <Button text='Invalid' size='xs' class_extra={`cursor-not-allowed`}/>
                    </ToolTip>
                    :
                    <ToolTip text={`[Error]: ` + (comment ? "Comment " : "Post ") + "is invalid!"}>
                      <Button text='Invalid' size='xs' class_extra={`cursor-not-allowed`}/>
                    </ToolTip>
                  }
                </div>
              }

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePopup;