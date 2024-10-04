
/** @note discord webhook output */
export const alert_new_forum_post = (address: string, forum: string, post_id: string, post_title: string): string => {
  const dialog = `
### [New Post Made] :pencil2:

Made on Forum: **[${forum}]**
Post Title: **[${post_title}]**
Address: **[${address.slice(0, 30) + "..."}]**
Total Forum Posts: **[${post_id}]**
  `;
  return dialog;
}

export const alert_new_forum_post_like = (address: string, forum: string, post_id: string, total_likes: string, post_title: string): string => {
  const dialog = `
### New Post Like :heart_hands:

Post: **[${forum + "/" + post_id}]**
Post Title: **[${post_title}]**
Liked By: **[${address.slice(0, 30) + "..."}]**
Total Likes: **[${total_likes}]**
  `;
  return dialog;
}

export const alert_new_forum_post_comment = (address: string, forum: string, post_id: string, total_comments: string, post_title: string, comment_text: string): string => {
  const dialog = `
### New Post Comment :pencil2:

Post: **[${forum + "/" + post_id}]**
Post Title: **[${post_title}]**
Commented By: **[${address.slice(0, 30) + "..."}]**
Comment: **[${comment_text}]**
Total Post Comments: **[${total_comments}]**
  `;
  return dialog;
}

export const alert_new_token_like = (liker_address: string, token_ticker: string, total_likes: string): string => {
  const dialog = `
### [New token like] :hearts:

[Token]: **$${token_ticker}**
[Address]: **${liker_address}**
[Token Likes]: **${total_likes}**
  `;
  return dialog
}

export const alert_new_token_comment = (commenter_address: string, token_ticker: string, total_comments: string): string => {
  const dialog = `
### [New token comment] :pencil2:

[Token]: **$${token_ticker}**
[Address]: **${commenter_address}**
[Token Comments]: **${total_comments}**
  `;
  return dialog
}

export const alert_post_tipped = (
  address:        string,
  forum:          string,
  post_id:        string,
  post_title:     string,
): string => {
  const dialog = `
### A Post Got Tipped! :moneybag:

Post: **[${forum + "/" + post_id}]**
Post Title: **[${post_title}]**
Tipped By: **[${address.slice(0, 30) + "..."}]**
  `;
  return dialog;
}

export const alert_comment_tipped = (
  address:        string,
  forum:          string,
  comment_id:        string,
  post_id:     string,
): string => {
  const dialog = `
### A Comment Got Tipped! :moneybag:

Post: **[${forum + "/" + post_id}]**
Comment ID: **[${comment_id}]**
Tipped By: **[${address.slice(0, 30) + "..."}]**
  `;
  return dialog;
}
