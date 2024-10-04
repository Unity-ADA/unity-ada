import { FC, useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";

import UnityMD from "./UnityMD";
import Button from "./Button";

import { site_roles } from "@/consts/global";

import { forum_comment, project_comment } from "@/utils/Interfaces";
import { copy_to_clipboard, format_unix_time } from "@/utils/StringUtils";
import LimitedParagraph from "./LimitedParagraph";

interface custom_props {
  project_comment:   project_comment | forum_comment;
  index:             number;

  handle_tip_comment: (c: project_comment | forum_comment) => Promise<null | undefined>;
  handle_delete_comment: (c: project_comment | forum_comment) => Promise<null | undefined>;
  handle_edit_comment: (c: project_comment | forum_comment) => Promise<null | undefined>;
  handle_like_comment: (c: project_comment | forum_comment) => Promise<null | undefined>;
};

const ProjectComment: FC <custom_props> = ({
  project_comment, index, handle_delete_comment, handle_edit_comment, handle_like_comment, handle_tip_comment
}) => {
  const [post_likes, set_post_likes] = useState('0');

  const [author_wallet_connected, set_author_wallet_connected] = useState(false);
  const [mod_wallet_connected, set_mod_wallet_connected]       = useState(false);
  const [admin_wallet_connected, set_admin_wallet_connected]   = useState(false);

  const [mod_comment, set_mod_comment]     = useState(false);
  const [admin_comment, set_admin_comment] = useState(false);

  const [comment_full_details, set_comment_full_details] = useState<number  | null>(null);
  const [show_unix, set_show_unix] = useState(false);
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

  const toggle_sure_to_delete = () => {
    set_sure_to_delete(!sure_to_delete);
  }

  const get_post_likes = () => {
    if (project_comment.likers) {
      set_post_likes(project_comment.likers.length.toString())
    }
  }

  const set_whose_comment = () => {
    if (site_roles.admin.granted_to.includes(project_comment.author)) {
      set_admin_comment(true);
    } else if (site_roles.mod.granted_to.includes(project_comment.author)) {
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
        set_author_wallet_connected((await wallet.getChangeAddress()).toString() == project_comment.author)
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

  return (
    <section className="w-full relative">
      <div className="w-full lg:p-8 p-5 bg-neutral-950/50 backdrop-blur rounded-xl border-2 border-neutral-800 flex-col justify-start items-start flex">
        <div className="w-full flex-col justify-start items-start gap-3.5 flex">
          <div className="w-full justify-between items-center inline-flex">
            <div className="justify-start items-center gap-2.5 flex">
              <div className="w-10 h-10 bg-neutral-900 rounded-full justify-start items-start gap-2.5 flex">
                <div className="rounded-full font-bold m-auto text-violet-400">{'#' + (index + 1)}</div>
              </div>
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <a href={"https://pool.pm/" + project_comment.author} className="text-violet-400 text-sm font-semibold tracking-wide leading-snug truncate max-w-20 md:max-w-80">{project_comment.ada_handle ? project_comment.ada_handle : project_comment.author}</a>
                <h6 className="text-neutral-400 text-xs font-normal leading-5">{format_unix_time(project_comment.created_at)}</h6>
                  {project_comment.last_updated && project_comment.updated_comment &&
                    <h3 className="text-xs text-neutral-500">
                      <code>
                        Comment has been edited.
                      </code>
                    </h3>
                  }
              </div>
            </div>

            <div className="justify-end items-center flex flex-wrap gap-2">
              <div onClick={() => handle_like_comment(project_comment)} className="">
                <Button icon="heart_solid" text={post_likes} size="xs" class_extra="hover:fill-rose-600 hover:text-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
              </div>

              <div onClick={() => toggle_show_full_comment_details(index)} className="">
                <Button icon="detail_solid" size="xs" class_extra="hover:fill-neutral-500 hover:text-neutral-500 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
              </div>

              { has_author_power && (
                <div onClick={() => handle_edit_comment(project_comment)} className="">
                  <Button icon="edit_solid" size="xs" class_extra="hover:fill-yellow-600 hover:yellow-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
                </div>
              )}

              { (has_author_power || has_mod_power) && (
                <>
                  { !sure_to_delete ? 
                    <div onClick={toggle_sure_to_delete} className="flex">
                      <Button icon="delete_solid" size="xs" class_extra="hover:fill-rose-600 hover:text-rose-600 fill-neutral-300 transition-all duration-700 ease-in-out cursor-pointer"/>
                    </div>
                  :
                    <div onClick={() => handle_delete_comment(project_comment)} className="">
                      <Button icon="delete_solid" text={'Are you sure?'} size="xs" class_extra="cursor-pointer fill-rose-600"/>
                    </div>
                  }
                </>
              )}
            </div>
          </div>

          {!(comment_full_details === index) ?
            <div className="w-full text-neutral-300">
              <UnityMD>
                {project_comment.last_updated && project_comment.updated_comment ?
                  project_comment.updated_comment
                  :
                  project_comment.post
                }
              </UnityMD>
            </div>
            :
            <div>
              <div className="flex flex-row flex-wrap gap-2">
                <Button text={'Author: ' + project_comment.author} size="xs" max_w="max-w-40" url={'https://pool.pm/' + project_comment.author} target="_blank"/>

                {project_comment.ada_handle && (
                  <Button icon="ada_handle" text={project_comment.ada_handle} size="xs" url={'https://pool.pm/' + project_comment.ada_handle} target="_blank"/>
                )}

                <div onClick={() => copy_to_clipboard(project_comment.signature)}>
                  <Button text={'Signature: ' + project_comment.signature} size="xs" max_w="max-w-40" class_extra="cursor-copy"/>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-2 py-4">
                <Button icon="hashtag_solid" text={'Global ID: ' + project_comment.id} size="xs" class_extra="cursor-default fill-neutral-300"/>
                <Button icon="heart_solid" text={project_comment.likers ? project_comment.likers.length : "0"} size="xs" class_extra="cursor-default fill-rose-600"/>

                <div onClick={toggle_show_unix}>
                  <Button icon="clock_solid" text={show_unix ? project_comment.created_at : format_unix_time(project_comment.created_at)} size="xs" class_extra="cursor-pointer fill-neutral-300"/>
                </div>
                {project_comment.last_updated && project_comment.updated_comment && (
                  <div onClick={toggle_show_unix} className="flex">
                    <Button icon="clock_solid" text={'Last updated: ' + show_unix ? project_comment.last_updated : format_unix_time(project_comment.last_updated)} size="xs" class_extra="cursor-pointer fill-neutral-300"/>
                  </div>
                )}
              </div>

              <div>
                <h3 className="uppercase text-sm text-neutral-400"><code>Original comment</code></h3>
                <div className="px-4 py-2 text-neutral-300 max-w-60 md:max-w-full">
                  <LimitedParagraph text={project_comment.post}/>
                </div>
              </div>

              {project_comment.last_updated && project_comment.updated_comment && (
                <div className="py-2">
                  <h3 className="uppercase text-sm text-neutral-400"><code>Edited comment</code></h3>
                  <div className="px-4 py-2 text-neutral-300 max-w-60 md:max-w-full">
                    <LimitedParagraph text={project_comment.updated_comment}/>
                  </div>
                </div>
              )}
            </div>
          }

          <div className="py-2 flex flex-wrap gap-2">
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
        </div>
      </div>
    </section>
  )
}

export default ProjectComment;