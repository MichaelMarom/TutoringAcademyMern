import React, { useState } from "react";

const Tooltip = ({ text, children, direction = "top", width="100px" }) => {
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
        <div className={`custom-tooltip ${direction}`}
        style={{
          width
        }}
        >{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
