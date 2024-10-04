"use client"

import Button from '@/components/Button';
import UnityMD from '@/components/UnityMD';
import { error_toast, new_forum_post, site_roles, toast_strings } from '@/consts/global';
import { supabase } from '@/utils/api/supabase';
import { send_webhook } from '@/utils/api/webhooks';
import { forum_post } from '@/utils/Interfaces';
import { useWallet } from '@meshsdk/react';
import { FC, useEffect, useState } from 'react';
import { fetch_db, useForumDetails, usePageInfo } from './utils';
import CreatePostPopup from './create-post-popup';
import Breadcrumb from '@/components/Breadcrumb';
import { alert_new_forum_post } from '@/consts/webhook-strings';

const ForumSection: FC = () => {
  const subpage_forum = usePageInfo();
  const { forum_posts_db_name, forum_cmts_db_name } = useForumDetails(subpage_forum as string);
  const [posts, set_posts] = useState<forum_post[]>();

  useEffect(() => {
    if (subpage_forum === "general") {
      if (forum_cmts_db_name && forum_posts_db_name) {
        fetch_db(forum_posts_db_name, forum_cmts_db_name).then(data => set_posts(data));
      }
    }
  }, [subpage_forum, forum_posts_db_name, forum_cmts_db_name]);

  const [connected_address, set_connected_address] = useState<string>();

  const [is_popup_open, set_is_popup_open] = useState(false);
  const [title_text, set_title_text] = useState('');
  const [post_text, set_post_text] = useState('');
  const [tag_text, set_tag_text] = useState('');
  const [wallet_handle, set_wallet_handle] = useState('');

  const [do_create_post, set_do_create_post] = useState(false);

  const use_wallet = useWallet();
  const is_connected = use_wallet.connected;
  const wallet = use_wallet.wallet;

  const toggle_create_popup = () => {
    clear_data();
    set_is_popup_open(!is_popup_open);
  }

  const clear_data = () => {
    set_title_text('');
    set_post_text('');
    set_tag_text('');
    set_wallet_handle('');
    set_do_create_post(false);
  }

  const handle_create_post = async () => {
    if (is_connected) {
      const signing_data = new_forum_post(connected_address as string, subpage_forum as string, title_text);

      try {
        const signature = await wallet.signData(signing_data, connected_address);
        if (signature && forum_posts_db_name && forum_cmts_db_name) {
          const create_post_data = {
            tag: tag_text,
            title: title_text,
            post: post_text,
            author: connected_address,
            created_at: Math.floor(Date.now() / 1000),
            signature: signature.signature,
            ada_handle: wallet_handle != "" ? wallet_handle : undefined
          }

          const { error } = await supabase
            .from(forum_posts_db_name)
            .insert([create_post_data])
            .single();

          if (error) {
            console.error(error);
          } else {
            const wh_txt = alert_new_forum_post(wallet_handle != "" ? wallet_handle : connected_address as string, subpage_forum as string, (posts ? (posts.length + 1).toString() : "0"), title_text)
            send_webhook(wh_txt, "forum_posts");
            fetch_db(forum_posts_db_name, forum_cmts_db_name).then(data => set_posts(data));
            toggle_create_popup();
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          error_toast(error.message);
        } else {
          throw (error);
        }
      }
    } else {
      error_toast(toast_strings.failed_wallet);
      return null;
    }
  }

  const check_for_wallet = async () => {
    if (is_connected) {
      const addr = (await wallet.getChangeAddress()).toString();
      set_connected_address(addr);
    } else {
      set_connected_address(undefined);
    }
  }

  useEffect(() => {
    if (do_create_post) {
      handle_create_post();
    }
  }, [do_create_post]);

  useEffect(() => {
    check_for_wallet();
  }, [is_connected]);

  return (
    <div>
      <Breadcrumb sub_page_1='Forums' active_page={subpage_forum}/>

      <div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <h3 className="text-2xl font-bold text-neutral-300">
              Welcome to the <code className="text-violet-400">{subpage_forum}</code> Forums
            </h3>
          </div>
        </div>
      </div>


      <div className='flex flex-wrap gap-2 py-4 md:px-10'>
        { is_connected &&
          <>
            { subpage_forum === "unity" ?
              <>
                {site_roles.admin.granted_to.includes(connected_address as string) &&
                  <div onClick={toggle_create_popup}>
                    <Button text={'Create Post'} size='xs' class_extra='cursor-pointer'/>
                  </div>
                }
              </>
              :
              <div onClick={toggle_create_popup}>
                <Button text={'Create Post'} size='xs' class_extra='cursor-pointer'/>
              </div>
            }
          </>
        }
      </div>

      <div className='px-4 grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-10 justify-items-center py-4'>
        {posts && posts.sort((a, b) => b.likers?.length - a.likers?.length).map((post, i) => (
          <div key={i} className="w-full rounded-lg bg-neutral-950/50 backdrop-blur px-4 py-2 border-2 border-neutral-800">
            <div className='flex flex-row justify-between gap-2 pb-2 items-center'>
              <Button icon='heart_solid' text={post.likers && post.likers.length.toString() || "0"} size='xs' class_extra='fill-rose-400 cursor-default'/>

              {post.tag && (
                <span className="cursor-default flex uppercase tracking-wider font-bold py-1 items-center px-2 rounded-lg text-xs bg-neutral-600/30 text-violet-400/90">
                  {'#' + post.tag}
                </span>
              )}

              <Button icon='comments_solid' text={post.comment_count && post.comment_count.toString() || "0"} size='xs' class_extra='fill-blue-400 cursor-default'/>
            </div>

            <h3 className='py-1 mt-2 text-center tracking-wider text-xl font-bold uppercase text-neutral-200'>
              {post.title}
            </h3>

            <div className="p-2 mb-4 text-gray-500 text-neutral-400 h-15 overflow-y-auto mt-4 px-2 text-center text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <UnityMD>
                {post.post.length > 100 ? post.post.substring(0, 100) + '...' : post.post}
              </UnityMD>
            </div>

            <div className='flex flex-wrap flex-row justify-center gap-2 pt-2'>
              <Button icon='read_solid' text='Read Post' size='xs' url={'/forums/' + subpage_forum + '/' + post.id} class_extra='fill-neutral-300'/>
            </div>
          </div>
        ))}
      </div>

      <CreatePostPopup
        toggle_popup={toggle_create_popup}
        is_popup_open={is_popup_open}
        title_text={title_text}
        set_title_text={set_title_text}
        post_text={post_text}
        set_post_text={set_post_text}
        tag_text={tag_text}
        set_tag_text={set_tag_text}
        wallet_handle={wallet_handle}
        set_wallet_handle={set_wallet_handle}
        set_do_create_post={set_do_create_post}
      />

    </div>
  )
}

export default ForumSection;