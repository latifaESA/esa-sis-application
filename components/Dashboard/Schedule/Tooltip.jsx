import React from 'react';

const Tooltip = ({ content, position, active, onClose }) => {
  if (!active) return null;

  return (
    <div className="tooltip" style={{ left: position.left, top: position.top }}>
      <div className="tooltip-content">
        {content}
        <button className="close-tooltip" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Tooltip;
