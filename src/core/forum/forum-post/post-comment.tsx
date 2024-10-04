import { FC, useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";

import { site_roles } from "@/consts/global";

import { forum_comment, project_comment } from "@/utils/Interfaces";
import { copy_to_clipboard, format_unix_time } from "@/utils/StringUtils";
import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import Icon from "@/components/Icons";

interface custom_props {
  comment: forum_comment;
  index:   number;

  connected_address: string;

  toggle_edit_popup: (c: forum_comment) => void;

  handle_tip_comment: (c: forum_comment) => Promise<void>;
  handle_delete_comment: (c: forum_comment) => Promise<void>;

  handle_like_comment: (comment: forum_comment) => Promise<null | undefined>;
};

const CommentComponent: FC <custom_props> = ({
  comment, index,
  handle_delete_comment, toggle_edit_popup, handle_like_comment, handle_tip_comment,
  connected_address,
}) => {
  const [post_likes, set_post_likes] = useState('0');

  const [author_wallet_connected, set_author_wallet_connected] = useState(false);
  const [mod_wallet_connected, set_mod_wallet_connected]       = useState(false);
  const [admin_wallet_connected, set_admin_wallet_connected]   = useState(false);

  const [mod_comment, set_mod_comment]     = useState(false);
  const [admin_comment, set_admin_comment] = useState(false);

  const [comment_full_details, set_comment_full_details] = useState<number  | null>(null);
  const [show_unix, set_show_unix] = useState(false);
  const [show_edited_unix, set_show_edited_unix] = useState(false);
  const [sure_to_delete, set_sure_to_delete] = useState(false);

  const wallet = useWallet().wallet;
  const is_connected = useWallet().connected;

  const has_author_power = is_connected && (author_wallet_connected || mod_wallet_connected || admin_wallet_connected);
  const has_mod_power    = is_connected && (mod_wallet_connected || admin_wallet_connected);

  const toggle_show_full_comment_details = (index: number) => {
    set_comment_full_details(comment_full_details === index ? null : index);
  }

  const toggle_show_unix = () => {
    set_show_unix(!show_unix);
  }

  const toggle_show_edited_unix = () => {
    set_show_edited_unix(!show_edited_unix);
  }

  const toggle_sure_to_delete = () => {
    set_sure_to_delete(!sure_to_delete);
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
  
    if (sure_to_delete) {
      timeout = setTimeout(() => {
        set_sure_to_delete(false);
      }, 5000);
    }
  
    return () => {
      clearTimeout(timeout);
    }
  }, [sure_to_delete]);

  const get_post_likes = () => {
    if (comment.likers) {
      set_post_likes(comment.likers.length.toString())
    }
  }

  const set_whose_comment = () => {
    if (site_roles.admin.granted_to.includes(comment.author)) {
      set_admin_comment(true);
    } else if (site_roles.mod.granted_to.includes(comment.author)) {
      set_mod_comment(true);
    }
    return false;
  }

  const set_connected_wallet_roles = async () => {
    if (is_connected) {
      if (site_roles.admin.granted_to.includes((await wallet.getChangeAddress()).toString())) {
        set_admin_wallet_connected(true);
        return true;
      } else if (site_roles.mod.granted_to.includes((await wallet.getChangeAddress()).toString())) {
        set_mod_wallet_connected(true);
      } else {
        set_author_wallet_connected((await wallet.getChangeAddress()).toString() == comment.author)
      }
    }
  }

  useEffect(() => {
    set_connected_wallet_roles();
  }, [is_connected]);

  useEffect(() => {
    set_connected_wallet_roles();
    get_post_likes();
    set_whose_comment();
  }, []);

  function truncate_long_words(text: string) {
    const words = text.split(' ');
    const truncatedWords = words.map(word => {
      if (word.length > 30) {
        return word.substring(0, 30) + '...';
      }
      return word;
    });
    return truncatedWords.join(' ');
  }

  return (
    <section className="">
      <div className="w-full lg:p-8 p-5 bg-neutral-950/50 backdrop-blur rounded-xl border-2 border-neutral-800 flex-col justify-start items-start flex">
        <div className="w-full flex-col justify-start items-start gap-3.5 flex">
          <div className="w-full justify-between items-center inline-flex">
            
      <div className='flex flex-wrap'>
        <div className='p-0.5 flex flex-col md:flex-row md:flex-wrap md:items-center gap-2'>
          <div className='cursor-default bg-violet-400 rounded-full w-10 h-10 flex justify-center items-center'>
            <span className='text-neutral-900 font-bold text-sm'>{'#' + index + 1}</span>
          </div>
          <div className='md:w-1 md:h-full md:rounded-full md:bg-neutral-900'/>
          <div className='flex flex-wrap flex-col gap-1'>
            <div className='flex flex-col md:flex-row text-violet-400 font-bold gap-1'>
              {comment.author.slice(0, 20) + "..."}

              {comment.ada_handle && (
                <div className='flex'>
                  <div className='md:mx-2 md:rounded-full md:bg-neutral-900 md:w-1 md:h-full'>&nbsp;</div>
                  <Icon icon='ada_handle' extra_class='size-6 ml-1 -mr-1'/>
                  <span className='text-[#0cd15b]/70'>{comment.ada_handle.slice(0, 20) + "..."}</span>
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button icon="heart_solid" text={post_likes} size="xs" class_extra="cursor-default fill-rose-600"/>

              <div onClick={() => toggle_show_full_comment_details(index)}>
                <Button icon='detail_solid' size='xs' class_extra='fill-neutral-500 cursor-pointer'/>
              </div>
              {!(comment_full_details === (index)) && (
                <div onClick={toggle_show_unix}>
                  <Button icon='clock_solid' text={show_unix ? comment.created_at : format_unix_time(comment.created_at)} size='xs' class_extra='fill-neutral-300 cursor-pointer'/>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

          </div>

          {!(comment_full_details === index) ?
            <div className="w-full text-neutral-300">
              <UnityMD>
                {comment.last_updated && comment.updated_comment ?
                  comment.updated_comment
                  :
                  comment.post
                }
              </UnityMD>
            </div>
            :
            <div>
            <div className="flex flex-row flex-wrap items-center gap-2 py-2 my-4">
              <div className="flex flex-wrap gap-2">
                <Button icon="hashtag_solid" text={'Global ID: ' + comment.id} size="xs" class_extra="cursor-default fill-neutral-300"/>
                <Button icon="heart_solid" text={'Likers: ' + (post_likes)} size="xs" class_extra="cursor-default fill-rose-600"/>
              </div>
              
              <div className="flex flex-row flex-wrap gap-2 py-2">
                <Button text={'Author: ' + comment.author} size="xs" max_w="max-w-40" url={'https://pool.pm/' + comment.author} target="_blank"/>
                {comment.ada_handle && (
                  <Button icon="ada_handle" text={comment.ada_handle} size="xs" url={'https://pool.pm/' + comment.ada_handle} target="_blank" max_w='md:max-w-full max-w-40'/>
                )}
                <div onClick={() => copy_to_clipboard(comment.signature)}>
                  <Button text={'Signature: ' + comment.signature} size="xs" max_w="max-w-40" class_extra="cursor-copy"/>
                </div>
              </div>
            </div>

              <div className="flex flex-col gap-4">
                  <div className='rounded-md border-2 border-neutral-900 px-2 py-4'>
                    <h3 className="uppercase text-sm text-neutral-400"><code>Original post</code></h3>
                    
                    <div className="px-4 py-2 text-neutral-300 break-words">
                      <code>{truncate_long_words(comment.post)}</code>
                    </div>
                  </div>

                  {comment.last_updated && comment.updated_comment && (
                    <>
                    {comment.last_updated && comment.updated_comment && (
                      <div onClick={toggle_show_edited_unix} className="flex">
                        <Button icon="clock_solid" text={'Last updated: ' + (show_edited_unix ? comment.last_updated : format_unix_time(comment.last_updated))} size="xs" class_extra="cursor-pointer fill-neutral-300"/>
                      </div>
                    )}
                    <div className='rounded-md border-2 border-neutral-900 px-2 py-4'>
                      <h3 className="uppercase text-sm text-neutral-400"><code>Updated post</code></h3>

                      <div className="px-4 py-2 text-neutral-300 break-words">
                        <code>{truncate_long_words(comment.updated_comment)}</code>
                      </div>
                    </div>
                    </>
                  )}
                </div>
            </div>
          }

          <div className="grid grid-cols-2 gap-2 py-2 w-full">
            <div className="flex gap-2 items-center">
              {admin_comment && (
                <span className="cursor-default bg-neutral-900 px-2 py-1 text-violet-400 text-xs rounded-lg">
                  Admin
                </span>
              )}

              {mod_comment && (
                <span className="cursor-default bg-neutral-900 px-2 py-1 text-amber-400 text-xs rounded-lg">
                  Mod
                </span>
              )}
            </div>

            {is_connected &&
              <div className="flex justify-end">
                <div className="justify-end items-center flex flex-wrap gap-2">
                  <div onClick={() => handle_like_comment(comment)} className="">
                    <Button icon="heart_solid" text={'Like'} size="xs" class_extra="hover:fill-rose-600 hover:text-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
                  </div>

                  <div onClick={() => handle_tip_comment(comment)}>
                    <Button icon="ada_logo" text={'Tip ₳1'} size='xs' class_extra="cursor-pointer"/>
                  </div>

                  { connected_address === comment.author && (
                    <div onClick={() => toggle_edit_popup(comment)} className="">
                      <Button icon="edit_solid" text={'Edit'} size="xs" class_extra="hover:fill-yellow-600 hover:yellow-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
                    </div>
                  )}

                  { (connected_address === comment.author || site_roles.admin.granted_to.includes(connected_address) || site_roles.mod.granted_to.includes(connected_address)) && (
                    <>
                      { !sure_to_delete ? 
                        <div onClick={toggle_sure_to_delete} className="flex">
                          <Button icon="delete_solid" size="xs" class_extra="hover:fill-rose-600 hover:text-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
                        </div>
                      :
                        <div onClick={() => handle_delete_comment(comment)} className="">
                          <Button icon="delete_solid" text={'Are you sure?'} size="xs" class_extra="cursor-pointer fill-rose-600"/>
                        </div>
                      }
                    </>
                  )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommentComponent;