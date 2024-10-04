import axios from 'axios';

const channels = {
  testbox: process.env.TESTBOX_WEBHOOK || '',
  unity_token_updates: process.env.UNITY_TOKEN_UPDATES_WEBHOOK || '',
  unity_forum_posts: process.env.UNITY_FORUM_POSTS_WEBHOOK || '',
}

type post_where = |
  "token_updates" | "forum_posts" | "testbox"

export const send_webhook = async (message: string, channel: post_where) => {
  const data = {
    content: message,
  };

  try {
    if (channel === "forum_posts") {
      await axios.post(channels.unity_forum_posts, data);
    } else if (channel === "token_updates") {
      await axios.post(channels.unity_token_updates, data);
    } else if (channel === "testbox") {
      await axios.post(channels.testbox, data);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};