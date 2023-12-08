import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function Messages({ selectedChat, messages }) {
  const messagesContainer = useRef(null);
  const { student } = useSelector(state => state.student)
  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [messages])
  return (
    <div className="ks-body ks-scrollable jspScrollable" data-auto-height="" data-reduce-height=".ks-footer" data-fix-height="32"
      style={{ height: '480px', overflowY: 'auto', padding: '0px', width: '100%' }} tabIndex="0" ref={messagesContainer}>
      <div className="jspContainer" style={{ width: '100%', height: '481px' }}>
        <div className="jspPane" style={{ padding: '0px', top: '0px', width: '100%' }}>
          <ul className="ks-items d-flex flex-column">
            {messages.map((message) => (
              <li key={message.id} className={`ks-item ${message.userId === student.AcademyId ? 'ks-from w-100' : 'ks-self w-100'}`}>
                <span className={`ks-avatar ${message.sender === 'User A' ? 'ks-offline' : 'ks-online'}`}>
                  <img src="https://bootdey.com/img/Content/avatar/avatar1.png" width="36" height="36" className="rounded-circle"
                    alt="User Avatar" />
                </span>
                <div className="ks-body">
                  <div className="ks-header">
                    <span className="ks-name">{message.sender}</span>
                    <span className="ks-datetime">{message.date}</span>
                  </div>
                  <div className="ks-message">{message.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Messages;
