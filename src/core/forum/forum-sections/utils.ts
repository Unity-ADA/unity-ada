import { error_toast, success_toast, toast_strings } from "@/consts/global";
import { supabase } from "@/utils/api/supabase";
import { forum_post } from "@/utils/Interfaces";
import { useEffect, useState } from "react";

const known_forums = ["general", "unity"];

export const useForumDetails = (subpage_forum: string) => {
  const [forum_posts_db_name, set_forum_posts_db_name] = useState<string>();
  const [forum_cmts_db_name, set_forum_cmts_db_name] = useState<string>();

  useEffect(() => {
    if (subpage_forum) {
      if (subpage_forum === "general") {
        set_forum_posts_db_name('General Forum');
        set_forum_cmts_db_name('General Forum Comments');
      } else if (subpage_forum === "unity") {
        set_forum_posts_db_name('Unity Announcements');
        set_forum_cmts_db_name('Unity Announcements Comments');
      }
    }
  }, [subpage_forum]);

  return { forum_posts_db_name, forum_cmts_db_name };
}

export const usePageInfo = () => {
  const [subpage, set_subpage] = useState<string>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const page_url = window.location.pathname;
      const page_slug = page_url.split('/').pop();

      if (page_slug && !known_forums.includes(page_slug)) {
        error_toast(toast_strings.failed_fetch);
        window.location.href = '/';
      } else if (page_slug) {
        set_subpage(page_slug);
      }
    }
  }, []);

  return subpage;
}

/** @note example: localhost:3000/forums/general/23 turns into ["general", "23"] */
export const use_last_two_subpages = (): [string, string] => {
  const [subpage1, set_subpage1] = useState<string>('');
  const [subpage2, set_subpage2] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const page_url = window.location.pathname;
      const url_parts = page_url.split('/');
      const subpage1 = url_parts[url_parts.length - 2];
      const subpage2 = url_parts[url_parts.length - 1];
      if (subpage1) {
        if (known_forums.includes(subpage1)) {
          set_subpage1(subpage1);
        } else {
          window.location.href = '/';
        }
      }
      if (subpage2) {
        set_subpage2(subpage2);
      }
    }
  }, []);

  return [subpage1, subpage2];
}

export const fetch_db = async (forum_posts_db_name: string, forum_cmts_db_name: string) => {
  if (forum_posts_db_name && forum_cmts_db_name) {
    const { data, error } = await supabase
      .from(forum_posts_db_name)
      .select('*');

    if (error) {
      error_toast(toast_strings.failed_fetch);
    } else {
      const postsWithCommentCount = await Promise.all(
        data.map(async (post) => {
          const { data: commentData, error: commentError } = await supabase
            .from(forum_cmts_db_name)
            .select('count')
            .eq('post_id', post.id);

          if (commentError) {
            error_toast(commentError.message);
            console.error(commentError);
            return { ...post, comment_count: 0 };
          } else {
            return { ...post, comment_count: commentData[0] && commentData[0].count };
          }
        })
      );
      success_toast(toast_strings.pass_fetch);
      return postsWithCommentCount;
    }
  } else {
    error_toast('Either no Post DB or Comments DB set!');
  }
};

export const fetch_post = async (post_id: number, posts_db: string, cmts_db: string) => {
  const { data: post_data, error: post_error } = await supabase
    .from(posts_db)
    .select('*')
    .eq('id', post_id)
    .single()
  const {data: cmts_data, error: cmts_error } = await supabase
    .from(cmts_db)
    .select('*')
    .eq('post_id', post_id);
  if (post_error || cmts_error) {
    error_toast(toast_strings.failed_fetch);
    window.location.href = '/';
  } else {
    success_toast(toast_strings.pass_fetch);
    return { post_data, cmts_data }
  }
}