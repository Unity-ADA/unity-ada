
import { FC, useEffect, useState }  from "react";
import { useWallet } from "@meshsdk/react";

import { project_comment, project_likes } from "@/utils/Interfaces";

import token from "@/unity/tokens";
import { add_comment_like, fetch_project_interactions } from "@/utils/api/Forum";
import ForumCommentComponent from "@/components/ForumComment";
import { error_toast, site_roles, success_toast, toast_strings } from "@/consts/global";
import { supabase } from "@/utils/api/supabase";
import Button from "@/components/Button";
import ColouredChip from "@/components/ColouredChip";
import CreatePopup from "@/components/CreatePopup";
import { Transaction } from "@meshsdk/core";
import ProjectComment from "@/components/ProjectComment";
import { send_webhook } from "@/utils/api/webhooks";
import { alert_new_token_comment, alert_new_token_like } from "@/consts/webhook-strings";

interface UserSocialInteractionProps {
  token: token;
}

const UserSocialInteraction: FC <UserSocialInteractionProps> = ({ token }) => {
  const wallet = useWallet();
  const [comments, set_comments] = useState<project_comment[]>();
  const [likes, set_likes] = useState<project_likes>();

  const [is_popup_open, set_is_popup_open] = useState(false);
  const [comment_text, set_comment_text] = useState('');
  const [show_all_comments, set_show_all_comments] = useState(false);
  const [is_edit, set_is_edit] = useState(false);

  const is_connected = wallet.connected;
  const [connected_address, set_connected_address] = useState('');
  const [wallet_handle, set_wallet_handle] = useState('');

  const [project_comment_to_edit, set_project_comment_to_edit] = useState<project_comment>();

  /** @note general operations */
  const handle_all_comments = () => {
    set_show_all_comments(!show_all_comments);
  }

  const toggle_comment_popup = async (c?: project_comment) => {
    if (!check_for_wallet()) {
      return null;
    }

    set_comment_text('');
    if (c) {
      set_comment_text(c.updated_comment || c.post);
      set_project_comment_to_edit(c);
      set_is_edit(true);
    }
    set_is_popup_open(!is_popup_open);
  }

  const toggle_edit_comment = async (comment: project_comment) => {
    if (!check_for_wallet()) {
      return null;
    }
  
    const is_author = comment.author === connected_address;
  
    if (is_author) {
      set_comment_text(comment.updated_comment || comment.post);
      set_project_comment_to_edit(comment);
      //set_is_edit_open(true);
    }
  };

  /** @note wallet operations */
  const get_wallet_address = async () => {
    if (is_connected) {
      set_connected_address((await wallet.wallet.getChangeAddress()).toString());
    } else {
      set_connected_address('');
    }
  }

  const wallet_has_liked_comment = (comment: project_comment, addr: string): boolean => {
    return comment.likers && comment.likers.includes(addr);
  }

  const wallet_has_liked_token = (addr: string): boolean => {
    if (likes) {
      if (likes.likers && likes.likers.includes(addr)) {
        return true;
      }
      return false;
    }
    return false;
  }

  /** @note comment operations */
  const fetch_token_comments = async (token_slug: string) => {
    const { c_data, l_data } = await fetch_project_interactions(token_slug);
    if (c_data) {
      set_comments(c_data as project_comment[]);
    }
    if (l_data) {
      set_likes(l_data as project_likes);
    }
  }

  const check_for_wallet = (): boolean => {
    if (!is_connected) {
      error_toast(toast_strings.failed_wallet);
      set_connected_address('');
      return false;
    }
    return true;
  }

  const handle_tip_comment = async (comment: project_comment) => {
    if (!check_for_wallet()) {
      return null;
    }
    const tip_amount = "100000";

    /**
     * @todo fix this
     */
    try {
      const tip_tx = new Transaction({ initiator: wallet.wallet }).sendLovelace(
        connected_address,
        tip_amount
      );
      const build_tx = await tip_tx.build();
      if (build_tx) {
        const signature = await wallet.wallet.signTx(build_tx);
  
        if (signature) {
          const tx_hash = await wallet.wallet.submitTx(signature);
          const times_tipped = comment.times_tipped ? (comment.times_tipped +1) : +1;
          console.log(tx_hash);
          const { error: updateError } = await supabase
            .from<"Project Comments", project_comment>('Project Comments')
            // @ts-ignore
            .update({ times_tipped: times_tipped })
            .eq('id', comment.id)
            .single();
          if (updateError) {
            console.error(updateError);
          }
  
          fetch_token_comments(token.slug);
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

  const handle_create_comment = async () => {
    if (!check_for_wallet()) {
      return null;
    }

    const s_data = `
      [New token comment]
      [Comment: ${comment_text}]
      [Commenter address: ${wallet_handle != "" ? wallet_handle : connected_address}]
    `;

    try {
      const signature = await wallet.wallet.signData(s_data.toString(), connected_address);
       if (signature) {
        const data_to_push = {
          post: comment_text,
          author: connected_address,
          created_at: Math.floor(Date.now() / 1000),
          project_slug: token.slug,
          signature: signature.signature,
          ada_handle: wallet_handle != "" ? wallet_handle : undefined
        };

        const { error } = await supabase
          .from('Project Comments')
          .insert([data_to_push])
          .single();

        if (error) {
          console.error(error);
        } else {
          send_webhook(
            alert_new_token_comment(connected_address, token.information.ticker, (comments && comments.length ? (comments.length + 1).toString() : "1")),
            "token_updates"
          );
          success_toast('New comment made!')
          fetch_token_comments(token.slug);
          toggle_comment_popup();
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'user declined sign data') {
        error_toast(error.message);
        console.log('User declined to sign the data');
      } else {
        throw error;
      }
    }
  }

  const handle_delete_comment = async (comment_id: number, comment_author: string) => {
    if (!check_for_wallet()) {
      return null;
    }

    const is_admin = site_roles.admin.granted_to.includes(connected_address);
    const is_mod = site_roles.mod.granted_to.includes(connected_address);
    const is_author = comment_author == connected_address;

    if (is_admin || is_mod || is_author) {
      try {
        let role = "Author.";
        if (is_admin) { role = "Admin." } else if (is_mod) { role = "Mod. "};

        const { error } = await supabase
          .from('Project Comments')
          .delete()
          .eq('id', comment_id);

        if (error) {
          console.error(error);
        } else {
          success_toast('Deleted by: ' + role);
          fetch_token_comments(token.slug);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handle_comment_like = async (comment: project_comment) => {
    if (!check_for_wallet()) {
      return null;
    }

    if (comment.likers.includes(connected_address)) {
      error_toast(toast_strings.already_liked_comment);
      return null;
    }

    if (!wallet_has_liked_comment(comment, connected_address)) {
      const s_data = `
        [New comment like]
        [Global Comment ID: ${comment.id}]
        [Liker address: ${connected_address}]
      `;

      try {
        const signature = await wallet.wallet.signData(s_data.toString(), connected_address);
        if (signature) {
          const updated_likers = comment.likers ? [...comment.likers, connected_address] : [connected_address];
          const { error: updateError } = await supabase
            .from('Project Comments')
            .update({ likers: updated_likers }) 
            .eq('id', comment.id)
            .single();
          if (updateError) {
            console.error(updateError);
          }
          success_toast('New liker added to comment! Comment likes: ' + updated_likers.length.toString());
          fetch_token_comments(token.slug);
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'user declined sign data') {
          error_toast(error.message);
        } else {
          throw error;
        }
      }
    }
  };

  const handle_token_like = async () => {
    if (!check_for_wallet()) {
      return null;
    }

    if (wallet_has_liked_token(connected_address)) {
      error_toast(toast_strings.already_liked_comment);
      return null;
    }

    if (!wallet_has_liked_token(connected_address)) {
      const s_data = `
        [New token like]
        [Token slug: ${token.slug}]
        [Liker address: ${connected_address}]
      `;

      try {
        const signature = await wallet.wallet.signData(s_data.toString(), connected_address);
        if (signature) {
          const updated_likers = likes?.likers ? [...likes.likers, connected_address] : [connected_address];
          
          /** @note check row exists */
          const { data, error: selectError } = await supabase
            .from<"Project Likes", project_likes>('Project Likes')
            .select('*')
            .eq('project_slug', token.slug)
            .single();
            
          let updateError;
          if (data) {
            /** @note if the row exists, update it */
            const { error } = await supabase
              .from('Project Likes')
              .update({ likers: updated_likers })
              .eq('project_slug', token.slug)
              .single();

            updateError = error;
          } else {
            /** @note if the doesn't, insert a new row */
            const { error } = await supabase
              .from('Project Likes')
              .insert( {project_slug: token.slug, likers: updated_likers} );

            updateError = error;
          }

          if (updateError) {
            console.error(updateError);
          } else {
            const hook_txt = alert_new_token_like(connected_address, token.information.ticker, updated_likers.length.toString());
            send_webhook(
              hook_txt,
              "token_updates"
            );
            success_toast('New liker added to token! Token likes: ' + updated_likers.length.toString());
            fetch_token_comments(token.slug);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'user declined sign data') {
          error_toast(error.message)
        } else {
          throw error;
        }
      }
    }
  };

  const handle_edit_comment = async () => {
    if (!check_for_wallet()) {
      return null;
    }
  
    const is_author = project_comment_to_edit?.author === connected_address;
  
    if (is_author) {
      const s_data = `
        [Comment Edited]
        [Global Comment ID: ${project_comment_to_edit.id}]
        [Liker address: ${connected_address}]
      `;

      try {
        const signature = await wallet.wallet.signData(s_data.toString(), connected_address);
        if (signature) {
          const { error } = await supabase
            .from('Project Comments')
            .update({ updated_comment: comment_text, last_updated: Math.floor(Date.now() / 1000) })
            .eq('id', project_comment_to_edit.id);
  
          if (error) {
            console.error(error);
          } else {
            success_toast('Comment updated!');
            console.log('Comment updated!');
            fetch_token_comments(token.slug);
            toggle_comment_popup();
            set_is_edit(false);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'user declined sign data') {
          error_toast(error.message);
        } else {
          throw error;
        }
      }
    }
  };

  useEffect(() => {
    fetch_token_comments(token.slug);
  }, []);

  useEffect(() => {
    get_wallet_address();
  }, [wallet.connected]);

  return (
    <div className="mb-6 w-full">
      <div className="py-4">
        <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
          <h3>
            {'Interact with '}
            <span className="text-violet-400">
              {token.information.name}
            </span>
          </h3>
          <div className="bg-violet-500 h-1 mb-3"/>
        </div>

        <div className="gap-2 flex justify-center items-center">
          <ColouredChip color="rose" text={"Likes: " + (likes?.likers?.length.toString() || "0")} size="xs"/>
          <ColouredChip color="sky" text={"Comments: " + (comments?.length.toString() || "0")} size="xs"/>
        </div>
      </div>

      <div>
        <div className="pb-4 flex items-center gap-4 flex-wrap">
          <h3 className="text-neutral-300 text-md font-medium tracking-wider">
            {show_all_comments ? "All Activity" : "Recent Comments"}
            <div className="bg-violet-500 h-1 mb-3"/>
          </h3>
          <div className="flex flex-wrap gap-2">
            <div onClick={handle_token_like}>
              <Button icon="heart_solid" text={'Like ' + token.information.name} size="xs" class_extra="fill-rose-400 cursor-pointer"/>
            </div>

            <div onClick={() => toggle_comment_popup()}>
              <Button icon="write_solid" text={'Create Comment'} size="xs" class_extra="fill-yellow-400 cursor-pointer"/>
            </div>

            <div onClick={handle_all_comments}>
              <Button icon="comments_solid" text={show_all_comments ? "Recent Comments" : "All Activity"} size="xs" class_extra="fill-blue-400 cursor-pointer"/>
            </div>
          </div>
        </div>

        {likes && show_all_comments && (
          <div className="py-4 flex flex-col gap-2">
            <div className="flex">
              <h3 className="text-sm text-neutral-400 uppercase font-medium tracking-wider">
                Token Likers
                <div className="h-1 bg-violet-500"/>
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {likes.likers && likes.likers.map((a, i) =>
                (<Button key={i} text={a} size="xs" class_extra="max-w-30" url={'https://pool.pm/' + a} target="_blank"/>)
              )}
            </div>
          </div>
        )}

        <div className="py-4 flex flex-col gap-2">
          {comments && show_all_comments && (
            <div className="flex">
              <h3 className="text-sm text-neutral-400 uppercase font-medium tracking-wider">
                Token Comments
                <div className="h-1 bg-violet-500"/>
              </h3>
            </div>
          )}

          <div className="flex flex-row flex-wrap justify-center items-center items-start gap-4 gap-y-10 py-6">
            {comments && !show_all_comments && comments.sort((a, b) => a.likers?.length - b.likers?.length).slice(0, 3).map((comment, i) =>
              (<ProjectComment
                key={i}
                handle_tip_comment={() => handle_tip_comment(comment)}
                handle_like_comment={() => handle_comment_like(comment)}
                handle_delete_comment={() => handle_delete_comment(comment.id, comment.author)}
                handle_edit_comment={() => toggle_comment_popup(comment)}
                project_comment={comment}
                index={i}
              />)
            )}
            {comments && show_all_comments && comments.map((comment, i) =>
              (<ProjectComment
                key={i}
                handle_tip_comment={() => handle_tip_comment(comment)}
                handle_like_comment={() => handle_comment_like(comment)}
                handle_delete_comment={() => handle_delete_comment(comment.id, comment.author)}
                handle_edit_comment={() => toggle_comment_popup(comment)}
                project_comment={comment}
                index={i}
              />)
            )}
          </div>
        </div>
      </div>

      <CreatePopup
        is_popup_open={is_popup_open}
        is_edit={is_edit}
        toggle_popup={project_comment_to_edit ? () => toggle_comment_popup(project_comment_to_edit) : toggle_comment_popup}
        comment={{ comment_text, set_comment_text, project_comment_to_edit }}
        set_wallet_handle={set_wallet_handle}
        on_finished={{ handle_create_comment, handle_edit_comment }}
      />

    </div>
  );
};

export default UserSocialInteraction;