import { FC } from "react";

interface custom_props {
  children:     React.ReactNode;
  extra_class?: string;
}

const Card: FC <custom_props> = ({
  children, extra_class
}) => {

  const card_class = `
    bg-neutral-950/30
    background-blur
    border-2
    border-neutral-800
    rounded-xl
    px-4 py-2
  `;

  return (
    <div className={card_class + " " + extra_class}>
      {children}
    </div>
  );
};

export default Card;
