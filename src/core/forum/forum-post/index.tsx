"use client"

import Breadcrumb from '@/components/Breadcrumb';
import { error_toast, forum_comment_edit, forum_post_edit, new_forum_post_comment, new_forum_post_like, site_roles, success_toast, toast_strings } from '@/consts/global';
import { supabase } from '@/utils/api/supabase';
import { forum_comment, forum_post } from '@/utils/Interfaces';
import { useWallet } from '@meshsdk/react';
import { FC, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { fetch_post, use_last_two_subpages, useForumDetails } from '../forum-sections/utils';

import Loader from '@/components/Loader';
import { send_webhook } from '@/utils/api/webhooks';
import EditPostPopup from './edit-post-popup';
import PostComponent from './post';
import CommentPostPopup from './create-comment-popup';
import CommentComponent from './post-comment';
import { alert_comment_tipped, alert_new_forum_post_comment, alert_new_forum_post_like, alert_post_tipped } from '@/consts/webhook-strings';
import { Transaction } from '@meshsdk/core';
import EditCommentPopup from './edit-comment';

const ForumPost: FC = () => {
  /** @note get page information */
  const page_url = use_last_two_subpages();
  const { forum_posts_db_name, forum_cmts_db_name } = useForumDetails(page_url[0] as string);
  const [post, set_post] = useState<forum_post>();
  const [comments, set_comments] = useState<forum_comment[]>();
  const [trigger_refresh, set_trigger_refresh] = useState(false);
  const [total_post_likes, set_total_post_likes] = useState(0);
  const [total_post_comments, set_total_post_comments] = useState(0);

  const known_forums = ["general"];

  useEffect(() => {
    if (known_forums.includes(page_url[0] as string)) {
      if (forum_cmts_db_name && forum_posts_db_name) {
        if (!post || !comments) {
          fetch_post(Number(page_url[1]), forum_posts_db_name, forum_cmts_db_name)
            .then(data => {
              if (data) {
                set_post(data.post_data);
                set_comments(data.cmts_data);

                if (data.post_data && data.post_data.likers) {
                  set_total_post_likes(data.post_data.likers.length);
                }
                if (data.cmts_data) {
                  set_total_post_comments(data.cmts_data.length);
                }
              }
            });
        }
      }
    }
  }, [page_url, forum_posts_db_name, forum_cmts_db_name, trigger_refresh]);
  /** @note we have all our info now to continue */

  /** @note general functions */
  const [sure_to_delete, set_sure_to_delete] = useState(false);

  const [is_edit_open, set_is_edit_open] = useState(false);
  const [is_comment_open, set_is_comment_open] = useState(false);
  const [is_edit_comment_open, set_is_edit_comment_open] = useState(false);

  const [do_edit_post, set_do_edit_post] = useState(false);
  const [do_comment_post, set_do_comment_post] = useState(false);
  const [do_edit_comment, set_do_edit_comment] = useState(false);

  const [post_edit_text, set_post_edit_text] = useState<string>('');

  const [wallet_handle, set_wallet_handle] = useState<string>('');
  const [comment_text, set_comment_text] = useState<string>('');
  const [temp_comment_data, set_temp_comment_data] = useState<forum_comment>();

  const clear_everything = (really: boolean = false) => {
    if (really) {
      set_post(undefined);
      set_comments(undefined);
    }

    set_sure_to_delete(false);
    set_is_edit_open(false);
    set_is_comment_open(false);
    set_is_edit_comment_open(false);
    set_do_edit_post(false);
    set_do_comment_post(false);
    set_do_edit_comment(false);
    set_post_edit_text('');
    set_wallet_handle('');
    set_comment_text('');
  }

  const toggle_edit_popup = () => {
    if (post) {
      set_post_edit_text(post.updated_post ? post.updated_post : post.post);
      set_is_edit_open(!is_edit_open);
    }
  }

  const toggle_comment_popup = () => {
    set_comment_text('');
    set_is_comment_open(!is_comment_open);
  }

  const toggle_edit_comment_popup = (comment: forum_comment) => {
    set_temp_comment_data(comment);
    set_comment_text(comment.updated_comment ? comment.updated_comment : comment.post);
    set_is_edit_comment_open(!is_edit_comment_open);
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

  /** @note wallet functions */
  const use_wallet = useWallet();
  const is_connected = use_wallet.connected;
  const wallet = use_wallet.wallet;
  const [connected_address, set_connected_address] = useState<string>();

  const check_for_wallet = async () => {
    if (is_connected) {
      const addr = (await wallet.getChangeAddress()).toString();
      set_connected_address(addr);
    } else {
      set_connected_address(undefined);
    }
  }

  const wallet_has_liked_post = (addr: string): boolean => {
    if (post && total_post_likes !== 0) {
      if (post.likers.includes(addr)) {
        return true;
      }
      return false;
    }
    return false;
  }

  useEffect(() => {
    check_for_wallet();
  }, [is_connected]);

  /** @note core post functions */
  const handle_post_delete = async () => {
    if (is_connected && connected_address && post) {
      const is_admin = site_roles.admin.granted_to.includes(connected_address);
      const is_mod = site_roles.mod.granted_to.includes(connected_address);
      const is_author = connected_address === post.author;
      if (is_admin || is_mod || is_author) {
        const { error: postError } = await supabase
          .from(forum_posts_db_name as string)
          .delete()
          .eq('id', Number(page_url[1]));
        const { error: commentError } = await supabase
          .from(forum_cmts_db_name as string)
          .delete()
          .eq('post_id', Number(page_url[1]));

        if (postError || commentError) {
          if (postError) {
            error_toast(postError.message)
          } else if (commentError) {
            error_toast(commentError.message)
          }
        }
        window.location.href = '/forums/' + page_url[0];
      }
    }
  }

  const handle_post_like = async () => {
    if (is_connected && connected_address && post) {
      if (wallet_has_liked_post(connected_address)) {
        error_toast(toast_strings.already_liked_post);
        return null;
      } else {
        const signing_data = new_forum_post_like(connected_address, post.title)
        try {
          const signature = await wallet.signData(signing_data, connected_address);
          if (signature) {
            const updated_likers = post.likers ? [...post.likers, connected_address] : [connected_address];
            const { error } = await supabase
              .from(forum_posts_db_name as string)
              .update({ likers: updated_likers})
              .eq('id', Number(page_url[1]))
              .single();
            if (error) {
              error_toast(error.message)
            } else {
              success_toast(toast_strings.new_like_post + updated_likers.length);
              const wh_txt = alert_new_forum_post_like(connected_address as string, page_url[0] as string, post.id.toString(), updated_likers.length.toString(), post.title)
              send_webhook(wh_txt, "forum_posts");
              set_trigger_refresh(prev => !prev);
              clear_everything(true);
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            error_toast(error.message)
          } else {
            throw error;
          }
        }
      }
    }
  }

  const handle_post_comment = async () => {
    if (is_connected && connected_address && post) {
      const signing_data = new_forum_post_comment(connected_address, post.title, comment_text);
      try {
        const signature = await wallet.signData(signing_data, connected_address);
        if (signature) {
          const data_to_push = {
            post: comment_text,
            author: connected_address,
            created_at: Math.floor(Date.now() / 1000),
            post_id: post.id,
            signature: signature.signature,
            ada_handle: wallet_handle != "" ? wallet_handle : undefined
          };

          const { error } = await supabase
            .from(forum_cmts_db_name as string)
            .insert([data_to_push])
            .single();

          if (error) {
            error_toast(error.message);
          } else {
            success_toast(toast_strings.new_comment_post + (total_post_comments + 1));
            const wh_txt = alert_new_forum_post_comment(connected_address as string, page_url[0] as string, post.id.toString(), (total_post_comments + 1).toString(), post.title, comment_text)
            send_webhook(wh_txt, "forum_posts");
            set_trigger_refresh(prev => !prev);
            clear_everything(true);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          error_toast(error.message)
        } else {
          throw error;
        }
        set_do_comment_post(false);
      }
    }
  }

  const handle_post_edit = async () => {
    if (is_connected && connected_address && post) {
      const is_author = connected_address === post.author;
      if (is_author) {
        try {
          const signing_data = forum_post_edit(connected_address, page_url[0] as string, post.title);
          const signature = await wallet.signData(signing_data, connected_address);
          if (signature) {
            const { error } = await supabase
              .from(forum_posts_db_name as string)
              .update({
                  signature: signature.signature,
                  updated_post: post_edit_text,
                  last_updated: Math.floor(Date.now() / 1000)
                }
              )
              .eq('id', post.id);

            if (error) {
              error_toast(error.message);
            } else {
              success_toast(toast_strings.post_edited);
              set_post(undefined);
              set_trigger_refresh(prev => !prev);
              clear_everything(true);
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            error_toast(error.message)
          } else {
            throw error;
          }
          set_do_edit_post(false);
        }
      } else {
        error_toast(toast_strings.no_access);
      }
    }
  }

  /** @todo i haven't tested this! */
  const handle_tip_post = async () => {
    if (is_connected && connected_address && post) {
      const tip_amount = "100000";

      try {
        const tip_tx = new Transaction({ initiator: wallet }).sendLovelace(
          post.author,
          tip_amount
        );
        const build_tip_tx = await tip_tx.build();
        if (build_tip_tx) {
          const signature = await wallet.signTx(build_tip_tx);
          if (signature) {
            const tx_hash = await wallet.submitTx(signature);
            console.log(tx_hash);

            const times_tipped = post.times_tipped ? (post.times_tipped + 1) : 1;
            const { error: updateError } = await supabase
              .from(forum_posts_db_name as string)
              .update({ times_tipped: times_tipped })
              .eq('id', post.id)
              .single();
            if (updateError) {
              console.error(updateError);
            } else {
              success_toast(toast_strings.post_tipped);
              set_post(undefined);
              const wh_txt = alert_post_tipped(connected_address as string, page_url[0] as string, post.id.toString(), post.title)
              send_webhook(wh_txt, "testbox");
              set_trigger_refresh(prev => !prev);
              clear_everything(true);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          error_toast(error.message);
        } else {
          throw error;
        }
      }
    }
  }

  /** @note core comment functions */
  const handle_comment_like = async (comment: forum_comment) => {
    if (is_connected && connected_address && comment) {
      if (comment.likers && comment.likers.includes(connected_address)) {
        error_toast(toast_strings.already_liked_comment);
        return null;
      } else {
        const signing_data = "New comment like";
        try {
          const signature = await wallet.signData(signing_data, connected_address);
          if (signature) {
            const updated_likers = comment.likers ? [...comment.likers, connected_address] : [connected_address];
            const { error: updateError } = await supabase
              .from(forum_cmts_db_name as string)
              .update({ likers: updated_likers }) 
              .eq('id', comment.id)
              .single();

            if (updateError) {
              console.error(updateError);
            }
            success_toast('New liker added to comment! Comment likes: ' + updated_likers.length.toString());
            clear_everything(true);
          }
        } catch (error) {
          if (error instanceof Error) {
            error_toast(error.message);
          } else {
            throw error;
          }
        }
      }
    }
  }

  const handle_comment_edit = async (comment: forum_comment) => {
    if (is_connected && connected_address && comment) {
      const is_author = comment.author === connected_address;
  
      if (is_author) {
        const signing_data = forum_comment_edit(connected_address, page_url[0] as string, comment.id.toString())//"Edited comment";

        try {
          const signature = await wallet.signData(signing_data, connected_address);
          if (signature) {
            const { error } = await supabase
              .from(forum_cmts_db_name as string)
              .update({ updated_comment: comment_text, last_updated: Math.floor(Date.now() / 1000) })
              .eq('id', comment.id);

            if (error) {
              console.error(error);
            } else {
              success_toast('Comment updated!');
              clear_everything(true);
            }
          }
        } catch (error) {
          clear_everything();
          if (error instanceof Error) {
            error_toast(error.message);
          } else {
            throw error;
          }
        }
      }
    }
  }

  const handle_comment_delete = async (comment: forum_comment) => {
    if (is_connected && connected_address) {
      const is_admin = site_roles.admin.granted_to.includes(connected_address);
      const is_mod = site_roles.mod.granted_to.includes(connected_address);
      const is_author = comment.author == connected_address;

      if (is_admin || is_mod || is_author) {
        try {
          let role = "Author.";
          if (is_admin) { role = "Admin." } else if (is_mod) { role = "Mod. "};

          const { error } = await supabase
            .from(forum_cmts_db_name as string)
            .delete()
            .eq('id', comment.id);

          if (error) {
            console.error(error);
          } else {
            success_toast('Deleted by: ' + role);
            clear_everything(true);
          }
        } catch (error) {
          throw error;
        }
      }
    }
  }

  const handle_comment_tip = async (comment: forum_comment) => {
    if (is_connected && connected_address) {
      const tip_amount = "100000";

      try {
        const tip_tx = new Transaction({ initiator: wallet }).sendLovelace(
          comment.author,
          tip_amount
        );
        const build_tip_tx = await tip_tx.build();
        if (build_tip_tx) {
          const signature = await wallet.signTx(build_tip_tx);
          if (signature) {
            const tx_hash = await wallet.submitTx(signature);
            console.log(tx_hash);

            const times_tipped = comment.times_tipped ? (comment.times_tipped + 1) : 1;
            const { error: updateError } = await supabase
              .from(forum_cmts_db_name as string)
              .update({ times_tipped: times_tipped })
              .eq('id', comment.id)
              .single();
            if (updateError) {
              console.error(updateError);
            } else {
              success_toast('Comment has been tipped');
              set_post(undefined);
              const wh_txt = alert_comment_tipped(connected_address as string, page_url[0] as string, comment.id.toString(), page_url[1] as string)
              send_webhook(wh_txt, "testbox");
              set_trigger_refresh(prev => !prev);
              clear_everything(true);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          error_toast(error.message);
        } else {
          throw error;
        }
      }
    }
  }

  useEffect(() => {
    if (do_comment_post) {
      handle_post_comment();
    } else if (do_edit_post) {
      handle_post_edit();
    } else if (do_edit_comment && temp_comment_data) {
      handle_comment_edit(temp_comment_data);
    }
  }, [do_comment_post, do_edit_post, do_edit_comment]);

  useEffect(() => {
  }, []);

  return ( post ?
    <div>
      <Breadcrumb sub_page_1='Forums' sub_page_2={page_url[0]} active_page={page_url[1]}/>

      { (site_roles.admin.granted_to.includes(connected_address as string)
        || site_roles.mod.granted_to.includes(connected_address as string))
        && (
          <div>
            <div>
              <h3 className='font-bold tracking-wider text-neutral-400'>
                Moderation Tools
              </h3>
            </div>

            <div className='flex flex-wrap gap-2 mt-10'>
              <div onClick={sure_to_delete ? handle_post_delete : toggle_sure_to_delete}>
                <Button icon="delete_solid" text={sure_to_delete ? 'Are you sure?' : 'Delete'} size='xs' class_extra='fill-rose-600 cursor-pointer'/>
              </div>

            </div>
          </div>
        )
      }

      <div className='px-2 md:px-8 mt-4 md:mt-10'>
        <PostComponent
          check_for_wallet={check_for_wallet}
          toggle_edit_popup={toggle_edit_popup}
          toggle_comment_popup={toggle_comment_popup}
          post={post}
          post_comments={total_post_comments}
          post_likes={total_post_likes}
          connected_address={connected_address as string}
          handle_post_like={handle_post_like}
          handle_post_delete={handle_post_delete}
          handle_tip_post={handle_tip_post}
        />
      </div>

      <div className='px-2 md:px-8'>
        <div className='flex justify-center pt-6'>
          <h3 className='font-bold tracking-wider text-neutral-400 '>
            Comments
          </h3>
        </div>

        <div className="py-4">
          { comments && comments.map((comment, i) => (
            comment &&
            <>
            <CommentComponent
              key={i}
              index={i}
              comment={comment}
              handle_tip_comment={() => handle_comment_tip(comment)}
              handle_like_comment={handle_comment_like}
              handle_delete_comment={() => handle_comment_delete(comment)}
              toggle_edit_popup={toggle_edit_comment_popup}
              connected_address={connected_address as string}
            />

            <EditCommentPopup
              key={i}
              comment={comment}
              check_for_wallet={check_for_wallet}
              toggle_popup={toggle_edit_comment_popup}
              is_popup_open={is_edit_comment_open}
              comment_text={comment_text}
              set_comment_text={set_comment_text}
              set_do_edit_comment={set_do_edit_comment}
              connected_address={connected_address as string}
            />
            </>
          ))}
        </div>
      </div>

      <CommentPostPopup
        check_for_wallet={check_for_wallet}
        toggle_popup={toggle_comment_popup}
        is_popup_open={is_comment_open}
        comment_text={comment_text}
        set_comment_text={set_comment_text}
        set_do_comment_post={set_do_comment_post}
        wallet_handle={wallet_handle}
        set_wallet_handle={set_wallet_handle}
        connected_address={connected_address as string}
      />

      <EditPostPopup
        check_for_wallet={check_for_wallet}
        toggle_popup={toggle_edit_popup}
        is_popup_open={is_edit_open}
        post_text={post_edit_text}
        set_post_text={set_post_edit_text}
        set_do_edit_post={set_do_edit_post}
        connected_address={connected_address as string}
      />
    </div>
    :
    <Loader/>
  )
}

export default ForumPost;