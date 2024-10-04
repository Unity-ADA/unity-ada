import { FC, useState } from "react";

interface ToolTipProps {
  text: string;
  children: JSX.Element;
}

const ToolTip: FC<ToolTipProps> = ({ text, children }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    const tooltipWidth = 200;
    const tooltipHeight = 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    const adjustedX = x + tooltipWidth > viewportWidth ? x - tooltipWidth : x;
    const adjustedY = y + tooltipHeight > viewportHeight ? y - tooltipHeight : y;
    setTooltipPosition({ x: adjustedX, y: adjustedY });
  };

  return (
    <div className={'has-tooltip'} onMouseMove={handleMouseMove}>
      {children}

      <div
        className="m-0.5 max-w-70 tooltip bg-neutral-900 rounded-lg border border-neutral-700 shadow-md shadow-neutral-950/80 flex items-center justify-center"
        style={{
          position: 'fixed',
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        <span className={`px-2 py-1 tracking-wider text-neutral-400 text-sm font-medium`}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default ToolTip;