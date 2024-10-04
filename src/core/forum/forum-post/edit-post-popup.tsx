import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import { string_rules } from "@/consts/global";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface custom_props {
  check_for_wallet: () => Promise<void>

  toggle_popup: () => void;
  is_popup_open: boolean;

  post_text: string;
  set_post_text: Dispatch<SetStateAction<string>>;

  set_do_edit_post: Dispatch<SetStateAction<boolean>>;

  connected_address: string;
}

const EditPostPopup: FC <custom_props> =  ({
  toggle_popup, is_popup_open,
  post_text, set_post_text,
  set_do_edit_post
}) => {
  const [show_preview, set_show_preview] = useState(false);

  const toggle_preview = () => {
    set_show_preview(!show_preview);
  }

  return (
    is_popup_open && (
      <div className="fixed inset-0 bg-neutral-950 bg-opacity-70 flex justify-center items-center z-10 transition-all duration-300">
        <div className="mx-4 bg-neutral-900 border-2 border-neutral-800 px-4 py-2 rounded-lg flex flex-col gap-2 md:w-1/2 px-4">
          
          <div className="text-lg font-bold text-neutral-300 tracking-wider flex flex-col justify-center items-center">
            <h3>
              {'Edit your '}
              <span className="text-violet-400">
                Post
              </span>
            </h3>
          </div>

          <div>
            <div>
              <div className='block'>
                <code className='text-xs'>{post_text.length + "/" + string_rules.MAX_CHARS_POST}</code>
                <textarea
                  className="min-h-20 max-h-100 w-full px-4 py-2 bg-neutral-950/70 rounded-md text-sm focus:bg-neutral-950/30 focus:text-neutral-300 text-neutral-400 placeholder-neutral-400 focus:ring-0 focus:outline-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500"
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

            <div className="flex justify-center gap-2">
            <div onClick={toggle_popup}>
              <Button text="Close Popup" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={toggle_preview}>
              <Button text="Toggle Preview" size="xs" class_extra="cursor-pointer"/>
            </div>
            <div onClick={() => set_do_edit_post(true)}>
              <Button text={"Edit Post"} size="xs" class_extra="cursor-pointer"/>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  );
}

export default EditPostPopup;