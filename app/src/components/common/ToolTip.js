import React, { useState } from "react";

const Tooltip = ({ text, children, direction = "top" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="custom-tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className={`custom-tooltip ${direction}`}>{text}</div>
      )}
    </div>
  );
};

export default Tooltip;