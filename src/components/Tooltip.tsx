import { useState } from "react";

type Props = {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

const Tooltip = ({ content, children, position = "top" }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className={`relative ${content.toUpperCase() === "LOGOUT" ? "w-full flex justify-center items-center" : `inline-block group`}`}
    >
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={
          content.toUpperCase() === "LOGOUT"
            ? "w-full flex items-center justify-center"
            : ""
        }
      >
        {children}
      </div>

      {isVisible && content && (
        <div
          className={`absolute z-50 px-3 py-2 text-[1.2vw] font-medium text-white bg-gray-800 rounded-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 border-2 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
