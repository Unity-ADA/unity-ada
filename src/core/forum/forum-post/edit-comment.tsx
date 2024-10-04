import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import { error_toast, string_rules } from "@/consts/global";
import { forum_comment } from "@/utils/Interfaces";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface custom_props {
  comment: forum_comment;
  check_for_wallet: () => Promise<void>

  toggle_popup: (comment: forum_comment) => void;
  is_popup_open: boolean;

  comment_text: string;
  set_comment_text: Dispatch<SetStateAction<string>>;

  set_do_edit_comment: Dispatch<SetStateAction<boolean>>;

  connected_address: string;
}

const EditCommentPopup: FC <custom_props> =  ({
  comment,
  toggle_popup, is_popup_open,
  comment_text, set_comment_text,
  set_do_edit_comment
}) => {
  const [show_preview, set_show_preview] = useState(false);

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

  const do_edit_comment = () => {
    const checked_passed = check_post();
    if (checked_passed) {
      set_do_edit_comment(true);
    } else {
      error_toast('Failed creation check!');
    }
  }

  return (
    is_popup_open && (
      <div className="fixed inset-0 bg-neutral-950 bg-opacity-70 flex justify-center items-center z-10 transition-all duration-300">
        <div className="mx-4 bg-neutral-900 border-2 border-neutral-800 px-4 py-2 rounded-lg flex flex-col gap-2 md:w-1/2 px-4">
          
          <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
            <h3>
              {'Edit your '}
              <span className="text-violet-400">
                Comment
              </span>
            </h3>
          </div>

          <div>
            <div>
              <div className='block'>
                <code className='text-xs'>{comment_text.length + "/" + string_rules.MAX_CHARS_COMMENTS}</code>
                <textarea
                  className="min-h-20 max-h-100 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500"
                  value={comment_text}
                  onChange={(e) => set_comment_text(e.target.value)}
                />
              </div>

              <div className={`block ${show_preview == true ? "min-h-20" : "hidden"}`}>
                <UnityMD>
                  {comment_text}
                </UnityMD>
              </div>
            </div>

            <div className="flex justify-center gap-2">
            <div onClick={() => toggle_popup(comment)}>
              <Button text="Close Popup" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={toggle_preview}>
              <Button text="Toggle Preview" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={do_edit_comment}>
              <Button text={"Edit Post"} size="xs" class_extra="cursor-pointer"/>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  );
}

export default EditCommentPopup;