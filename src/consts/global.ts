import toast from "react-hot-toast";

export const ADA_ATOMIC_UNIT: number = 1000000;
export const ADA_DECIMAL: number     = 6;

/** @note theme */
export const toast_theme = {
  style: {
    borderRadius: '4px',
    background: '#1c1917',
    color: '#e5e5e5',
  },
};

/** @note shown on home */
export const FEATURED_PROJECTS = {
  TOKENS: [ "unity", "mom" ], // 2 limit - slug
  APPS:   [ "Minswap", "DexHunter" ], // 2 limit - name
};

/** @note power roles */
export const site_roles = {
  admin: { 
    granted_to: [
      "addr1qx38ntczmlkdnyqm78acef790jrqr9ehjysy25trrxvhae89d6290nczn0y4ycyasla28sqqrtpytv3vuu0uqj4yu37q92rudl",
      "stake1u8jka9zheupfhj2jvzwc074rcqqp4sj9kgkww87qf2jwglqvdp5g2", /** @note legacy format */
      "$fakeadahandle", /** @note test */
    ]
  },
  mod: {
    granted_to: [
      "",
    ]
  }
}

/** @note forum logic */
export const string_rules = {
  MIN_CHARS:          3,
  MAX_CHARS_TAG:      12,
  MAX_CHARS_TITLE:    100,
  MAX_CHARS_POST:     600,
  MAX_CHARS_COMMENTS: 200
};

/** @note signing data */
export const new_forum_post = (poster_address: string, forum_name: string, post_title: string): string => {
  const dialog = `
[New Post]
[Made By]: ${poster_address}
[Created on]: ${forum_name}
[Post Title]: ${post_title}
  `;
  return dialog
}

export const forum_post_edit = (poster_address: string, forum_name: string, post_title: string): string => {
  const dialog = `
[Forum Post Edited]
[Edited By]: ${poster_address}
[Edited on]: ${forum_name}
[Post Title]: ${post_title}
  `;
  return dialog
}

export const forum_comment_edit = (poster_address: string, forum_name: string, comment_id: string): string => {
  const dialog = `
[Forum Comment Edited]
[Edited By]: ${poster_address}
[Edited on]: ${forum_name}
[Comment ID]: ${comment_id}
  `;
  return dialog
}

export const new_forum_post_like = (poster_address: string, post_title: string): string => {
  const dialog = `
[New Post Like]
[Liked By]: ${poster_address}
[Post Title]: ${post_title}
  `;
  return dialog
}

export const new_forum_post_comment = (poster_address: string, post_title: string, comment_text: string): string => {
  const dialog = `
[New Post Comment]
[Commented By]: ${poster_address}
[Post Title]: ${post_title}
[Comment]: ${comment_text}
  `;
  return dialog
}

/** @note toaster */

export const error_toast = (message: string) => toast.error(message, toast_theme);
export const success_toast = (message: string) => toast.success(message, toast_theme);

export const toast_strings = {
  no_access: "Your wallet doesnt have the access for this", /** @note this should never appear */

  failed_fetch:  "Unity failed to fetch the posts.",
  pass_fetch:    "Unity has fetched the posts.",

  failed_wallet: "Please connect your wallet.",
  pass_wallet:   "Wallet is connected.",

  already_liked_post:    "Your wallet has already liked this post.",
  already_liked_comment: "Your wallet has already liked this comment.",

  new_like_post: "A new like has been added to the post. Likers: ",
  new_comment_post: "A new comment has been added to the post. Comments: ",

  post_tipped: "You have successfully tipped this post!",
  post_edited: "Your post has been edited and updated.",
}