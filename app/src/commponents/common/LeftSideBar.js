import React from 'react';
import { FaTimes } from 'react-icons/fa';

const LeftSideBar = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''} bg-light border-end`}
      style={{
        width: '25%', 
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100%',
        zIndex: '1000', 
      }}
    >
      <button
        className="btn btn-link"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
        }}
        onClick={onClose}
      >
        <FaTimes />
      </button>
      {children}
    </div>
  );
};

export default LeftSideBar;
