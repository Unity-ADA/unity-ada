import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { forum_comment, project_comment } from "@/utils/Interfaces";
import Button from "./Button";
import ToolTip from "./Tooltip";4
import Chip from "./Chip";
import { site_roles } from "@/consts/global";
import { useWallet } from "@meshsdk/react";
import ColouredChip from "./ColouredChip";
import UnityMD from "./UnityMD";
import { copy_to_clipboard, format_unix_time } from "@/utils/StringUtils";
import LimitedParagraph from "./LimitedParagraph";
import { DataSignature } from "@meshsdk/core";
import { toast } from "react-toastify";

interface forum_comments_prop {
  forum_comment?:    forum_comment;
  project_comment?:  project_comment;
  index:             number;

  handle_tip_comment: (c: forum_comment | project_comment) => Promise<null | undefined>;
  handle_delete_comment: (c: forum_comment | project_comment) => Promise<null | undefined>;
  handle_edit_comment: (c: forum_comment | project_comment) => Promise<null | undefined>;
  handle_like_comment: (c: forum_comment | project_comment) => Promise<null | undefined>;
}

const ForumCommentComponent: FC <forum_comments_prop> = ({
  forum_comment, project_comment, index, handle_delete_comment, handle_edit_comment, handle_like_comment, handle_tip_comment,
}) => {
  const [show_original_comment, set_show_original_comment] = useState(false);
  const [comment_full_details, set_comment_full_details]   = useState<number  | null>(null);
  const forum_or_project_cmt                               = forum_comment || project_comment;

  const [mod_comment, set_mod_comment]     = useState(false);
  const [admin_comment, set_admin_comment] = useState(false);

  const [author_wallet_connected, set_author_wallet_connected] = useState(false);
  const [mod_wallet_connected, set_mod_wallet_connected]       = useState(false);
  const [admin_wallet_connected, set_admin_wallet_connected]   = useState(false);

  const [connected_address, set_connected_address] = useState('');

  const wallet = useWallet();
  const is_connected = wallet.connected;

  const error_toast = (message: string) => toast(message, { theme: "dark", bodyClassName: "text-rose-400"});
  const success_toast = (message: string) => toast(message, { theme: "dark", bodyClassName: "text-lime-400"});

  const toggle_show_original_comment = () => {
    set_show_original_comment(!show_original_comment);
  }

  const toggle_show_full_comment_details = (index: number) => {
    set_comment_full_details(comment_full_details === index ? null : index);
  }

  const get_wallet_address = async () => {
    if (is_connected) {
      const addr = (await wallet.wallet.getChangeAddress()).toString()
      set_connected_address(addr);
    } else {
      set_connected_address('');
    }
  }

  const has_author_power = is_connected && (author_wallet_connected || mod_wallet_connected || admin_wallet_connected);

  const set_whose_comment = () => {
    if (forum_or_project_cmt) {
      if (site_roles.admin.granted_to.includes(forum_or_project_cmt.author)) {
        set_admin_comment(true);
      } else if (site_roles.mod.granted_to.includes(forum_or_project_cmt.author)) {
        set_mod_comment(true);
      }
    }
    return false;
  }

  const set_connected_wallet_roles = async () => {
    if (is_connected) {
      if (site_roles.admin.granted_to.includes((await wallet.wallet.getChangeAddress()).toString())) {
        set_admin_wallet_connected(true);
        return true;
      } else if (site_roles.mod.granted_to.includes((await wallet.wallet.getChangeAddress()).toString())) {
        set_mod_wallet_connected(true);
      } else if (forum_or_project_cmt) {
        set_author_wallet_connected((await wallet.wallet.getChangeAddress()).toString() == forum_or_project_cmt.author)
      }
    }
  }

  useEffect(() => {
    get_wallet_address();
    set_connected_wallet_roles();
    set_whose_comment();
  }, [is_connected]);

  let post_likes = "0";
  if (forum_comment) {
    if (forum_comment.likers) {
      post_likes = forum_comment.likers.length.toString();
    }
  }
  if (project_comment) {
    if (project_comment.likers) {
      post_likes = project_comment.likers.length.toString();
    }
  }

  return ( forum_or_project_cmt &&
    <div className="border-2 border-neutral-800 bg-neutral-950 rounded-md w-80 md:min-w-full">
      <div className="flex flex-row flex-wrap gap-2 -mt-4 ml-2 pb-2">
        <Button icon="hashtag_solid" text={(index + 1).toString()} size="xs" class_extra='fill-neutral-300 cursor-default'/>

        <div onClick={() => handle_like_comment(forum_or_project_cmt)}>
          <ToolTip text={`Heart this ${project_comment ? "project" : "forum"} comment.`}>
            <Button icon="heart_solid" text={post_likes} size="xs" class_extra={`fill-rose-400 cursor-pointer`}/>
          </ToolTip>
        </div>

        <div onClick={() => toggle_show_full_comment_details(index)}>
          <ToolTip text={"Show full details."}>
            <Button icon='detail_solid' size='xs' class_extra='cursor-pointer fill-neutral-300'/>
          </ToolTip>
        </div>

        { forum_or_project_cmt.last_updated && forum_or_project_cmt.updated_comment && !(comment_full_details === index) && (
          <div onClick={toggle_show_original_comment}>
            <ToolTip text={show_original_comment == false && forum_or_project_cmt.updated_comment != null ? "Show original post." : "Show edited post."}>
              <Button icon='edited_solid' size='xs' class_extra='cursor-pointer dark:fill-neutral-300'/>
            </ToolTip>
          </div>
        )}

        { project_comment && (
          <div onClick={() => handle_tip_comment(project_comment)}>
            <Button text={'Tip Post'} size="xs" class_extra="cursor-pointer"/>
          </div>
        )}
      </div>

      <div className="flex flex-row flex-wrap gap-2 p-1 ml-4 items-center">
        {admin_comment && (<ColouredChip color="violet" text="admin" size="xs"/>)}
        {mod_comment && !admin_comment && (<ColouredChip color="sky" text="mod" size="xs"/>)}
        {forum_or_project_cmt.updated_comment != null && (<ColouredChip color="neutral" text="mod" size="xs"/>)}
      </div>

      <div className='flex flex-wrap flex-col gap-1 border-2 border-neutral-800 m-4 rounded-md'>
        {!(comment_full_details === index) ?
          <div>
            <div className='py-4 -mt-2 px-2 text-neutral-300'>
              <UnityMD>
                { show_original_comment == false && 
                  forum_or_project_cmt.updated_comment != null ? forum_or_project_cmt.updated_comment
                  : `${forum_or_project_cmt.post}`
                }
              </UnityMD>
            </div>

            <div className="flex flex-row flex-wrap gap-2 py-4 px-2">
              <Button icon="wallet_solid" text={forum_or_project_cmt.author} class_extra={`fill-blue-400 ${forum_or_project_cmt.author.startsWith('$') && 'text-lime-300'}`} max_w="max-w-30" size="xs" url={'https://pool.pm/' + forum_or_project_cmt.author} target='_blank'/>

              <div onClick={() => copy_to_clipboard(forum_or_project_cmt.signature)}>
                <Button icon='copy_solid' text={forum_or_project_cmt.signature} size='xs' class_extra='fill-neutral-300 cursor-copy' max_w='max-w-50'/> 
              </div>
            </div>
          </div>
          :
          <div className='py-4 -mt-2 px-2 text-neutral-300 min-h-25'>
            <div className='flex flex-col flex-wrap gap-2'>
              <div className='flex flex-row gap-2 flex-wrap p-0.5 items-center'>
                <div onClick={() => copy_to_clipboard(forum_or_project_cmt.author)}>
                  <Button icon='copy_solid' size='xs' class_extra='fill-neutral-300 cursor-copy'/>
                </div>
                <Button text={'Author: ' + forum_or_project_cmt.author} size='xs' url={'https://pool.pm/' + forum_or_project_cmt.author} target='_blank' max_w='max-w-40'/>
              </div>

              <div className='flex flex-row gap-2 flex-wrap items-center p-0.5'>
                <div onClick={() => copy_to_clipboard(forum_or_project_cmt.signature)}>
                  <Button icon='copy_solid' size='xs' class_extra='fill-neutral-300 cursor-copy'/>
                </div>
                <Chip text={'Signature: ' + forum_or_project_cmt.signature} size='xs' max_w='max-w-40'/>
              </div>

              <div className="overflow-y-auto mt-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
                <div className='flex flex-row gap-2 flex-wrap items-center p-0.5 mt-4 py-2'>
                  <Chip text={'Comment Likers:'} size='xs' max_w='max-w-40'/>
                </div>
                <div className="flex flex-wrap gap-2">
                  { forum_or_project_cmt.likers && forum_or_project_cmt.likers.map((l, i) => (
                    <Button key={i} text={l} size="xs" max_w="max-w-30" url={`https://pool.pm/` + l} target="_blank"/>
                  ))}
                </div>
              </div>

              <div className='flex flex-row gap-2 flex-wrap items-center p-0.5 mt-4 md:mt-10'>
                <Chip icon='time_solid' text={forum_or_project_cmt.created_at.toString()} size='xs'/>
                <Chip icon='time_solid' text={format_unix_time(forum_or_project_cmt.created_at)} size='xs'/>
              </div>

              <div className='flex flex-row gap-2 flex-wrap p-0.5'>
                <div>
                  <Chip text='Original Comment:' size='xs'/>
                </div>
              </div>

              <div className=''>
                <div className='border-2 border-neutral-800 rounded-md h-15 overflow-y-auto px-2 text-center text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-300 [&::-webkit-scrollbar-thumb]:bg-slate-400 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                  <LimitedParagraph text={forum_or_project_cmt.post} extra_class="h-10" use_code/>
                </div>
              </div>

              {forum_or_project_cmt.updated_comment != null && (
                <>
                  <div className='flex flex-row gap-2 flex-wrap items-center p-0.5 mt-4 md:mt-10'>
                    <Chip icon='time_solid' text={forum_or_project_cmt.last_updated.toString()} size='xs'/>
                    <Chip icon='time_solid' text={format_unix_time(forum_or_project_cmt.last_updated)} size='xs'/>
                  </div>

                  <div className='flex flex-row gap-2 flex-wrap p-0.5'>
                    <div>
                      <Chip text='Edited Comment:' size='xs'/>
                    </div>
                  </div>

                  <div className=''>
                    <div className='border-2 dark:border-neutral-600 rounded-md h-15 overflow-y-auto px-2 text-center text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-300 [&::-webkit-scrollbar-thumb]:bg-slate-400 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                      <p className='text-xs px-4 py-2'>
                        <LimitedParagraph text={forum_or_project_cmt.updated_comment} extra_class="h-10" use_code/>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        }
      </div>
      
      <div className="flex flex-row flex-wrap gap-2 -mb-4 mx-2 items-center pt-2">
        
        { has_author_power && (
          <div onClick={() => handle_delete_comment(forum_or_project_cmt)}>
            <ToolTip text={"Delete post."}>
              <Button icon="delete_solid" size="xs" class_extra="fill-rose-400 cursor-pointer"/>
            </ToolTip>
          </div>
        )}

        { is_connected && author_wallet_connected && (
          <div onClick={() => handle_edit_comment(forum_or_project_cmt)}>
            <ToolTip text={"Edit post."}>
              <Button icon="edit_solid" size="xs" class_extra="cursor-pointer fill-yellow-400 "/>
            </ToolTip>
          </div>
        )}

        <div className="flex flex-grow justify-end">
          <ToolTip text={'Unix: ' + forum_or_project_cmt.created_at.toString()}>
            <Chip
              icon='time_solid'
              text={format_unix_time(show_original_comment == false ?
                forum_or_project_cmt.updated_comment != null ? forum_or_project_cmt.last_updated : forum_or_project_cmt.created_at : forum_or_project_cmt.created_at)
              }
              size='xs'
            />
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

export default ForumCommentComponent;