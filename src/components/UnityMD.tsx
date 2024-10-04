import { FC } from "react";
import Markdown from "react-markdown";
import emoji_map from "@/consts/emoji-map";

const replace_emojis = (text: string): string => {
  // regular expression to match words wrapped by colons
  const regex = /:([^:\s]+):/g;
  return text.replace(regex, (match, word) => emoji_map[word] || match);
};

const UnityMD: FC <{ children: string | any }> = ({ children, ...props }) => {
  const replaced_text = replace_emojis(children);

  return (
    <Markdown
      components={{
        img: ({ node, ...props }) => {
          // Check if the image is an emoji
          if (props.alt && Object.keys(emoji_map).includes(props.alt)) {
            // Use the custom emoji image component
            return <span style={{ display: 'inline-block' }}><img className='w-4' {...props} /></span>;
          } else {
            // Use the default image component
            return <img className='mx-auto max-w-30 py-2 my-2 max-h-full' {...props} />;
          }
        },
        hr: ({ node, ...props }) => <hr className='my-4 mx-10 md:mx-30' {...props} />,
        p: ({ node, ...props }) => <p className='py-0.5 text-neutral-300' {...props} />,
        a: ({ node, ...props }) => <a className='py-0.5 text-violet-400 font-medium tracking-wider' {...props} />,
      }}
      {...props}
    >
      {replaced_text}
    </Markdown>
  );
};

export default UnityMD;