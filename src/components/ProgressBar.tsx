import React from "react";

interface ProgressBarProps {
  percent?: number; // 0-100
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percent = 0,
  className = "",
}) => {
  let p = Math.round(Number(percent) || 0);
  if (!isFinite(p) || p < 0) p = 0;
  if (p > 100) p = 100;

  if (p === 0) {
    return (
      <div className={`w-full h-1 rounded-full overflow-hidden ${className}`}>
        <div
          className="h-full w-full"
          style={{ backgroundColor: "var(--some-gray)" }}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full h-1 rounded-full overflow-hidden bg-gray-200 ${className}`}
    >
      <div
        className="h-full bg-green-200 rounded-full"
        style={{ width: `${p}%`, transition: "width 300ms ease" }}
      />
    </div>
  );
};

export default ProgressBar;
