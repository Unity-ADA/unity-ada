
import { forum_comment, project_comment, project_likes } from "../Interfaces";
import { supabase } from "./supabase";

export const fetch_project_interactions = async (project_slug: string) => {
  const { data: c_data, error: c_error } = await supabase
    .from('Project Comments')
    .select('*')
    .eq('project_slug', project_slug)

  const { data: l_data, error: l_error } = await supabase
    .from('Project Likes')
    .select('*')
    .eq('project_slug', project_slug)
    .single();

  if (c_error || l_error) {
    console.error(c_error || l_error);
  }
  return {c_data: c_data, l_data: l_data};
};

export const delete_project_comment = async (comment_id: string) => {
  const { error } = await supabase
  .  from('Project Comments')
    .delete()
    .eq('id', comment_id);
  
  if (error) {
    console.error(error);
  };
};

export const add_project_like = async (project_slug: string, user_address: string) => {
  const { data: l_data, error: l_error } = await supabase
    .from('Project Likes')
    .select('*')
    .eq('project_slug', project_slug)
    .single();

  const token_likers: project_likes = l_data as project_likes;

  const updatedLikers = token_likers ? [...token_likers.likers, user_address] : [user_address];

  const { data, error: selectError } = await supabase
    .from('Project Likes')
    .select('*')
    .eq('project_slug', project_slug)
    .single();

  let updateError;
  if (data) {
    const { error } = await supabase
      .from('Project Likes')
      .update({ likers: updatedLikers })
      .eq('project_slug', project_slug)
      .single();

    updateError = error;
  } else {
    const { error } = await supabase
      .from('Project Likes')
      .insert( {project_slug: info.slug, likers: updatedLikers} );

    updateError = error;
  }

  if (updateError) {
    console.error(updateError);
  }
};

export const add_comment_like = async (comment_id: number, is_project: boolean, likers: string[]) => {
  if (is_project) {
    const { error: updateError } = await supabase
      .from('Project Comments')
      .update({ likers: likers }) 
      .eq('id', comment_id)
      .single();

    if (updateError) {
      console.error(updateError);
    }
  } else {
    const { error: updateError } = await supabase
      .from('General Forum Comments')
      .update({ likers: likers }) 
      .eq('id', comment_id)
      .single();

    if (updateError) {
      console.error(updateError);
    }
  }
};
