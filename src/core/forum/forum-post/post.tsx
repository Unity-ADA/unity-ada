import Button from "@/components/Button";
import Icon from "@/components/Icons";
import UnityMD from "@/components/UnityMD";
import { site_roles } from "@/consts/global";
import { forum_post } from "@/utils/Interfaces";
import { copy_to_clipboard, format_unix_time } from "@/utils/StringUtils";
import { useWallet } from "@meshsdk/react";
import { FC, useEffect, useState } from "react";

interface custom_props {
  check_for_wallet: () => Promise<void>
  toggle_edit_popup: () => void;
  toggle_comment_popup: () => void;

  post: forum_post;
  post_comments: number;
  post_likes: number;

  connected_address: string;

  handle_post_like: () => Promise<null | undefined>;
  handle_post_delete: () => Promise<void>;
  handle_tip_post: () => Promise<void>;
}

const PostComponent: FC <custom_props> = ({
  check_for_wallet, toggle_edit_popup, toggle_comment_popup,
  post, post_comments, post_likes,
  connected_address,
  handle_post_like, handle_post_delete, handle_tip_post
}) => {
  const [post_full_details, set_post_full_details] = useState<boolean>(false);
  const [show_unix, set_show_unix] = useState(false);
  const [show_edited_unix, set_show_edited_unix] = useState(false);
  const [sure_to_delete, set_sure_to_delete] = useState(false);

  const [mod_post, set_mod_post]     = useState(false);
  const [admin_post, set_admin_post] = useState(false);

  const toggle_show_post_full_details = () => {
    set_post_full_details(!post_full_details);
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

  const use_wallet = useWallet();
  const is_connected = use_wallet.connected;

  const set_whose_post = () => {
    if (site_roles.admin.granted_to.includes(post.author)) {
      set_admin_post(true);
    } else if (site_roles.mod.granted_to.includes(post.author)) {
      set_mod_post(true);
    }
    return false;
  }

  useEffect(() => {
    check_for_wallet();
  }, [is_connected]);

  useEffect(() => {
    set_whose_post();
  }, [])

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
    <section className='rounded-xl border-2 border-neutral-800 bg-neutral-950/50 backdrop-blur p-2'>
      <div className='flex flex-wrap'>
        <div className='p-0.5 flex items-center gap-2'>
          <div className='cursor-default bg-violet-400 rounded-full w-10 h-10 flex justify-center items-center'>
            <span className='text-neutral-900 font-bold text-sm'>{'#' + post.id}</span>
          </div>
          <div className='w-1 h-full rounded-full bg-neutral-900'/>
          <div className='flex flex-wrap flex-col gap-1'>
            <div className='flex flex-col md:flex-row text-violet-400 font-bold gap-1'>
              {post.author.slice(0, 20) + "..."}

              {post.ada_handle && (
                <div className='flex'>
                  <div className='md:mx-2 md:rounded-full md:bg-neutral-900 md:w-1 md:h-full'>&nbsp;</div>
                  <Icon icon='ada_handle' extra_class='size-6 ml-1 -mr-1'/>
                  <span className='text-[#0cd15b]/70'>{post.ada_handle.slice(0, 20) + "..."}</span>
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button icon='heart_solid' text={post_likes} size='xs' class_extra='fill-rose-600'/>
              <Button icon='comments_solid' text={post_comments} size='xs' class_extra='fill-blue-600'/>

              <div onClick={toggle_show_post_full_details}>
                <Button icon='detail_solid' size='xs' class_extra='fill-neutral-500 cursor-pointer'/>
              </div>
              {!post_full_details && (
                <div onClick={toggle_show_unix}>
                  <Button icon='clock_solid' text={show_unix ? post.created_at : format_unix_time(post.created_at)} size='xs' class_extra='fill-neutral-300 cursor-pointer'/>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      
      <div className='py-4 px-2 text-center'>
        <div>
          <div className='flex justify-center'>
            <div className='cursor-default tracking-wider text-md bg-violet-800/30 text-violet-400 rounded-lg px-2 uppercase'>
              <code>{'#' + post.tag}</code>
            </div>
          </div>

          <div className="flex justify-center flex-col">
            <h3 className='text-2xl text-neutral-300 font-bold tracking-wide py-2'>
              {post.title}
            </h3>
          </div>

          <div className='py-4 md:py-10'>
            { !post_full_details ?
              <div className="w-full text-neutral-300">
                <UnityMD>
                  {post.last_updated && post.updated_post ?
                    post.updated_post
                    :
                    post.post
                  }
                </UnityMD>
              </div>
              :
              <div>
                <div className="flex flex-row flex-wrap items-center gap-2 py-2 my-4">
                  <div className="flex flex-wrap gap-2">
                    <Button icon="hashtag_solid" text={'Global ID: ' + post.id} size="xs" class_extra="cursor-default fill-neutral-300"/>
                    <Button icon="heart_solid" text={'Likers: ' + (post_likes)} size="xs" class_extra="cursor-default fill-rose-600"/>
                    <Button icon="comments_solid" text={'Comments: ' + (post_comments)} size="xs" class_extra="cursor-default fill-blue-600"/>
                  </div>
                  
                  <div className="flex flex-row flex-wrap gap-2 py-2">
                    <Button text={'Author: ' + post.author} size="xs" max_w="max-w-40" url={'https://pool.pm/' + post.author} target="_blank"/>
                    {post.ada_handle && (
                      <Button icon="ada_handle" text={post.ada_handle} size="xs" url={'https://pool.pm/' + post.ada_handle} target="_blank" max_w='md:max-w-full max-w-40'/>
                    )}
                    <div onClick={() => copy_to_clipboard(post.signature)}>
                      <Button text={'Signature: ' + post.signature} size="xs" max_w="max-w-40" class_extra="cursor-copy"/>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row flex-wrap gap-2 py-4">
                  <div onClick={toggle_show_unix}>
                    <Button icon="clock_solid" text={'Originally posted: ' + (show_unix ? post.created_at : format_unix_time(post.created_at))} size="xs" class_extra="cursor-pointer fill-neutral-300"/>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className='rounded-md border-2 border-neutral-900 px-2 py-4'>
                    <h3 className="uppercase text-sm text-neutral-400"><code>Original post</code></h3>
                    
                    <div className="px-4 py-2 text-neutral-300 break-words">
                      <code>{truncate_long_words(post.post)}</code>
                    </div>
                  </div>

                  {post.last_updated && post.updated_post && (
                    <>
                    {post.last_updated && post.updated_post && (
                      <div onClick={toggle_show_edited_unix} className="flex">
                        <Button icon="clock_solid" text={'Last updated: ' + (show_edited_unix ? post.last_updated : format_unix_time(post.last_updated))} size="xs" class_extra="cursor-pointer fill-neutral-300"/>
                      </div>
                    )}
                    <div className='rounded-md border-2 border-neutral-900 px-2 py-4'>
                      <h3 className="uppercase text-sm text-neutral-400"><code>Updated post</code></h3>

                      <div className="px-4 py-2 text-neutral-300 break-words">
                        <code>{truncate_long_words(post.updated_post)}</code>
                      </div>
                    </div>
                    </>
                  )}
                </div>
              </div>
            }
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 w-full">
            <div className="flex gap-2 items-center">
              {admin_post && (
                <span className="cursor-default bg-neutral-900 px-2 py-1 text-violet-400 text-xs rounded-lg">
                  Admin
                </span>
              )}

              {mod_post && (
                <span className="cursor-default bg-neutral-900 px-2 py-1 text-amber-400 text-xs rounded-lg">
                  Mod
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <div className="justify-end items-center flex flex-wrap gap-2">
                {is_connected && (
                  <>
                    <div onClick={handle_post_like}>
                      <Button icon="heart_solid" text={'Like'} size='xs' class_extra='fill-neutral-300 hover:fill-rose-500 transition-all duration-300 cursor-pointer'/>
                    </div>

                    <div onClick={toggle_comment_popup}>
                      <Button icon="comment_solid" text={'Comment'} size='xs' class_extra="fill-neutral-300 hover:fill-blue-500 transition-all duration-300 cursor-pointer"/>
                    </div>

                    <div onClick={handle_tip_post}>
                      <Button icon="ada_logo" text={'Tip ₳1'} size='xs' class_extra="cursor-pointer"/>
                    </div>

                    {/** @note only authors should be able to edit a post! */}
                    { connected_address === post.author && 
                      <div onClick={toggle_edit_popup}>
                        <Button icon="edit_solid" text={'Edit'} size='xs' class_extra="fill-neutral-300 hover:fill-yellow-600 transition-all duration-300 cursor-pointer"/>
                      </div>
                    }

                    { (connected_address === post.author || site_roles.admin.granted_to.includes(connected_address) || site_roles.mod.granted_to.includes(connected_address)) &&
                      <div className="cursor-pointer" onClick={sure_to_delete ? handle_post_delete : toggle_sure_to_delete}>
                        <Button icon="delete_solid" text={sure_to_delete ? 'Are you sure?' : ''} size='xs' class_extra={sure_to_delete ? "fill-rose-600" : "fill-neutral-300" + ` hover:fill-rose-600 transition-all duration-300`}/>
                      </div>
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PostComponent;