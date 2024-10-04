import Button from "@/components/Button";
import ColouredChip from "@/components/ColouredChip";
import LimitedParagraph from "@/components/LimitedParagraph";
import UnityMD from "@/components/UnityMD";
import { supabase } from "@/utils/api/supabase";
import { forum_comment, forum_post } from "@/utils/Interfaces";
import { FC, useEffect, useState } from "react";

const TopPosts: FC = () => {
  const [posts, setPosts] = useState<forum_post[]>([]);

  const forum_section_id = "general";

  const fetchPosts = async (id: string) => {
    let data, error;
    if (id === 'general') {
      ({ data, error } = await supabase.from<"General Forum", forum_post>('General Forum').select('*'));
    }

    if (error) {
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
            return { ...post, comment_count: commentData[0]?.count};
          }
        })
      );

      setPosts(postsWithCommentCount as forum_post[]);
    }
  };

  useEffect(() => {
    fetchPosts(forum_section_id);
  }, []);

  return (
    <div className='flex flex-col justify-center mt-10 md:mt-20 subgrid'>
      <div className='flex items-center justify-between px-4 py-1'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-medium tracking-wider text-neutral-300'>
            Unity Forums <sup className="text-violet-400">{'(Top Posts)'}</sup>
            <div className="border-2 border-violet-400 w-full"/>
          </h3>
        </div>

        <div className="flex gap-2">
          <Button text='Enter Forums' size='xs' url="/forums"/>
        </div>
      </div>

      <div className='px-4 grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center py-10'>
        {posts.sort((a, b) => b.likers?.length - a.likers?.length).slice(0, 3).map((post, i) => (
          <div key={i} className="rounded-lg px-4 py-2 border-2 border-neutral-800 bg-neutral-950/50 background-blur">
            <div className='flex flex-row justify-between items-center gap-2 pb-2 items-center'>
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

            <div className="p-2 mb-4 text-gray-500 text-neutral-400 h-15 overflow-y-auto mt-4 px-2 text-center text-sm [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <UnityMD>
                {post.post.length > 100 ? post.post.substring(0, 100) + '...' : post.post}
              </UnityMD>
            </div>

            <div className='flex flex-wrap flex-row justify-center gap-2 pt-2'>
              <Button icon='read_solid' text='Read Post' size='xs' url={'/forums/' + forum_section_id + '/' + post.id} class_extra='fill-neutral-300'/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPosts;