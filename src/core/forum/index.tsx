import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import UnityMD from "@/components/UnityMD";
import { toast_theme } from "@/consts/global";
import { supabase } from "@/utils/api/supabase";
import { forum_comment, forum_post } from "@/utils/Interfaces";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ForumIndex: FC = () => {
  const [general_posts, set_general_posts] = useState<forum_post[]>([]);

  const error_toast = (message: string) => toast.error(message, toast_theme);
  const success_toast = (message: string) => toast.success(message, toast_theme);

  const toast_strings = {
    failed_fetch: "Unity failed to fetch the posts.",
    pass_fetch:   "Unity has fetched the posts.",
  }

  const fetch_general_posts = async () => {
    const { data, error } = await supabase.from<"General Forum", forum_post>('General Forum').select('*');

    if (error) {
      error_toast(toast_strings.failed_fetch);
      console.error(error);
    } else {
      const postsWithCommentCount = await Promise.all(
        (data as forum_post[]).map(async (post) => {
          const { data: commentData, error: commentError } = await supabase
            .from<"General Forum Comments", forum_comment>('General Forum Comments')
            .select('count')
            .eq('post_id', post.id);

          if (commentError) {
            console.error(commentError);
            return { ...post, comment_count: 0 };
          } else {
            success_toast(toast_strings.pass_fetch);
            return { ...post, comment_count: commentData[0] && commentData[0].count };
          }
        })
      );

      set_general_posts(postsWithCommentCount as forum_post[]);
    }
  };

  useEffect(() => {
    fetch_general_posts();
  }, []);

  return (
    <div>
      <Breadcrumb active_page="Forums"/>

      <div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <h3 className="text-2xl font-bold text-neutral-300">
              Welcome to the <code className="text-violet-400">Unity Forums</code>
            </h3>
          </div>

          <div className="flex justify-center cursor-default">
            <div className="border-2 border-neutral-800 bg-neutral-950/50 px-4 py-1 md:w-1/2">
              <h3 className="text-neutral-400 text-center py-2 px-2">
                <code>
                  The Unity Forums take advantage of Cardano's CIP-8 technology allowing
                  anyone to engage with their Browser Wallet and all for free with zero signup!<br/>
                  Ada Handles are also supported!
                </code>
              </h3>
            </div>

          </div>
        </div>
      </div>

      { general_posts && (
        <div className="py-4">
          <div className="flex flex-row flex-wrap gap-2 items-center px-2 mt-4">
            <Button text={'View All General Posts'} size='xs' url='/forums/general'/>
          </div>
          <div className="py-2 grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
            { general_posts.sort((a, b) => b.likers?.length - a.likers?.length).slice(0, 3).map((post, i) => (
              <div key={i} className="w-full rounded-lg bg-neutral-950/50 px-4 py-2 border-2 border-neutral-800">
                <div className='flex flex-row gap-2 pb-2 justify-between items-center'>
                  <Button icon='heart_solid' text={post.likers && post.likers.length.toString() || "0"} size='xs' class_extra='fill-rose-400 cursor-default'/>
                  {post.tag && (
                    <span className="cursor-default py-1 tracking-widest uppercase font-bold flex items-center px-2 rounded-lg text-xs bg-neutral-600/30 text-violet-400/90">
                      {'#' + post.tag}
                    </span>
                  )}
                  <Button icon='comments_solid' text={post.comment_count && post.comment_count.toString() || "0"} size='xs' class_extra='fill-blue-400 cursor-default'/>
                </div>

                <h3 className='py-1 mt-2 text-center font-medium tracking-wider text-lg uppercase text-neutral-200'>
                  {post.title}
                </h3>

                <div className="p-2 mb-4 h-15 overflow-y-auto mt-4 px-2 text-center text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
                  <UnityMD>
                    {post.post.length > 100 ? post.post.substring(0, 100) + '...' : post.post}
                  </UnityMD>
                </div>

                <div className='flex flex-wrap flex-row justify-center gap-2 pt-2'>
                  <Button icon='read_solid' text='Read Post' size='xs' url={'/forums/' + 'general' + '/' + post.id} class_extra='fill-neutral-300'/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumIndex;