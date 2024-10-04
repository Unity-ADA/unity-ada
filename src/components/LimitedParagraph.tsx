import React , { FC } from "react";
import { bold_type } from "@/utils/Types";

interface custom_props {
  text: string;
  extra_class?: string;
  use_code?: boolean;
}

const LimitedParagraph: FC <custom_props> = ({
  text, extra_class, use_code
}) => {
  const div_class = `
    px-3 flex ${extra_class}
    overflow-y-auto mt-4 w-3/4
    [&::-webkit-scrollbar]:h-1
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-neutral-700
    [&::-webkit-scrollbar-thumb]:bg-neutral-500
  `;

  return (
    <div className={div_class}>
      {use_code ? <code>{text}</code> : <p>{text}</p>}
    </div>
  );
};

export default LimitedParagraph;
