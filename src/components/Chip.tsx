import React, { FC } from "react";
import { bold_type, size_type } from "@/utils/Types";
import Icon from "./Icons";

interface ChipProps {
  text?: string;
  size: size_type;
  bold_type?: bold_type;
  max_w?: string;
  icon?: string;
}

const Chip: FC <ChipProps> = ({ text, size, bold_type, max_w, icon }) => {
  let fontSize = "";
  let iconSize = "";

  switch (size) {
    case "xs": fontSize = "text-xs"; iconSize = "size-4"; break;
    case "sm": fontSize = "text-sm"; iconSize = "size-6"; break;
    case "md": fontSize = "text-md"; iconSize = "size-8"; break;
    case "lg": fontSize = "text-lg"; iconSize = "size-10"; break;
    case "xl": fontSize = "text-xl"; iconSize = "size-12"; break;
    default: break;
  }


  let bold = "";
  switch (bold_type) {
    case "medium": bold = "font-medium"; break;
    case "bold": bold = "font-bold"; break;
    default: break;
  }

  const customClass = `
    ${fontSize}
    ${bold}
    border border-neutral-800
    relative
    flex flex-row justify-center items-center fill-neutral-300
    select-none
    whitespace-nowrap
    rounded-md
    py-1 px-4
    uppercase
    leading-none
    text-black
    font-medium
    tracking-wider
    bg-neutral-900/50
    text-neutral-400`;

  const icon_class = `
    ${iconSize}
    mx-1
  `;

  return (
    <span className={customClass}>
      {icon && (<Icon icon={icon} extra_class={icon_class + " opacity-80"}/>)}
      {text && (
        <code className={`${max_w} px-1 truncate uppercase tracking-widest`}>
          {text}
        </code>
      )}
    </span>
  );
};

export default Chip;