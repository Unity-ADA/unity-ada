import { FC } from "react";
import { bold_type, size_type } from "@/utils/Types";
import Icon from "./Icons";
import Link from "next/link";
import SocialIcon from "./SocialIcons";

interface custom_props {
  text?: string | number ;
  size: size_type;
  bold_type?: bold_type;
  class_extra?: string;
  icon?: string;
  url?: string;
  target?: string;
  scale?: boolean;
  max_w?: string;
  img?: string;
  social_icon?: string;
}

const Button: FC <custom_props> = ({ text, size, bold_type, class_extra, icon, url, target, scale, max_w, img, social_icon }) => {
  let fontSize = "";
  let iconSize = "";
  let imgSize = "";

  switch (size) {
    case "xs": fontSize = "text-xs"; iconSize = "size-4"; imgSize = "w-4"; break;
    case "sm": fontSize = "text-sm"; iconSize = "size-6"; imgSize = "w-6"; break;
    case "md": fontSize = "text-md"; iconSize = "size-8"; imgSize = "w-8"; break;
    case "lg": fontSize = "text-lg"; iconSize = "size-10"; imgSize = "w-10"; break;
    case "xl": fontSize = "text-xl"; iconSize = "size-12"; imgSize = "w-12"; break;
    default: break;
  }

  let bold = "";
  switch (bold_type) {
    case "medium": bold = "font-medium"; break;
    case "bold": bold = "font-bold"; break;
    default: break;
  }

  let scale_effect = "";
  if (scale) { scale_effect = `hover:scale-105`; }

  const button_class = `
    ${fontSize}
    ${bold}
    ${class_extra}
    ${scale_effect}
    border border-neutral-800 text-neutral-200 bg-neutral-950/50
    flex overflow-hidden items-center shadow whitespace-pre group relative justify-center gap-2 rounded-md
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
    py-1 px-4
    transition-all duration-300 ease-out text-decoration-none
  `;

  const hover_effect = `
    absolute right-0
    -mt-12 h-32 w-8 translate-x-12 rotate-12
    bg-white opacity-10
    transition-all duration-1000 ease-out
    group-hover:-translate-x-full
  `;

  const icon_class = `
    ${iconSize}
  `;

  const image_class = `
    ${imgSize}
    rounded-md
  `;

  return (
    <>
      {!url ? 
        <span className={button_class}>
          <span className={hover_effect}/>

          {img && (<img src={img} className={image_class} />)}
          {icon && (<Icon icon={icon} extra_class={icon_class}/>)}
          {social_icon && (<SocialIcon icon={social_icon} extra_class={icon_class}/>)}
          {text && (
            <code className={`truncate uppercase tracking-widest ${max_w}`}>
              {text}
            </code>
          )}
        </span>
      :
        <Link className={button_class} href={url as string} target={target}>
          <span className={hover_effect}/>

          {img && (<img src={img} className={image_class} />)}
          {icon && (<Icon icon={icon} extra_class={icon_class}/>)}
          {social_icon && (<SocialIcon icon={social_icon} extra_class={icon_class}/>)}
          {text && (
            <code className={`truncate uppercase tracking-widest ${max_w}`}>
              {text}
            </code>
          )}
        </Link>
      }
    </>
  );
};

export default Button;
