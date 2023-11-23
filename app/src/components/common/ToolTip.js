import React, { useState } from "react";
const tooltipStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  height: 'auto',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  overflow: 'hidden',
};

const Tooltip = ({ text, children, direction = "top", width = "100px" }) => {
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
            width,
            whiteSpace: "normal"
          }}
        >{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
