import React, { FC } from "react";
import { bold_type, color_type, size_type } from "@/utils/Types";
import Icon from "./Icons";

interface ChipProps {
  text: string;
  size: size_type;
  bold_type?: bold_type;
  color: color_type;
}

const ColouredChip: FC <ChipProps> = ({ text, size, bold_type, color }) => {
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

  let color_text   = "";
  let color_bg = "bg-neutral-900";
  switch (color) {
    case "violet": color_text = "text-violet-300"; color_bg = "bg-violet-700/60"; break;
    case "sky": color_text = "text-sky-300"; color_bg = "bg-sky-700/60"; break;
    case "amber": color_text = "text-amber-300"; color_bg = "bg-amber-700/60"; break;
    case "rose": color_text = "text-rose-300"; color_bg = "bg-rose-700/60"; break;
    case "neutral": color_text = "text-neutral-300"; color_bg = "bg-neutral-700/60"; break;
  };

  const customClass = `
    ${fontSize}
    ${bold}
    ${color_text}
    ${color_bg}
    relative
    flex flex-row justify-center items-center
    select-none
    whitespace-nowrap
    rounded-full
    py-1 px-4
    uppercase
    leading-none
    font-medium
    tracking-wider
  `;

  const icon_class = `
    ${iconSize}
    mx-1
  `;

  return (
    <span className={customClass}>
      <code className={`px-1 truncate uppercase tracking-widest`}>
        {text}
      </code>
    </span>
  );
};

export default ColouredChip;