import React, { useState } from 'react';

function Messages({ chatId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'User A',
      text: 'Hello, how are you?',
      userId: 'user123',
      status: 'sent',
      image: null,
      video: null,
      audio: null,
      referenceMessageId: null,
      date: '2023-10-27 15:30:00',
    },
    {
      id: 2,
      sender: 'User B',
      text: 'I am doing well, thanks!',
      userId: 'user456',
      status: 'delivered',
      image: 'https://example.com/image1.jpg',
      video: null,
      audio: null,
      referenceMessageId: null,
      date: '2023-10-27 15:35:00',
    },
    {
      id: 3,
      sender: 'User A',
      text: 'That\'s great to hear.',
      userId: 'user123',
      status: 'read',
      image: null,
      video: 'https://example.com/video1.mp4',
      audio: null,
      referenceMessageId: 1,
      date: '2023-10-27 15:40:00',
    },
    {
      id: 4,
      sender: 'User B',
      text: 'Yes, it is. Here\'s a video of it.',
      userId: 'user456',
      status: 'sent',
      image: null,
      video: null,
      audio: 'https://example.com/audio1.mp3',
      referenceMessageId: 3,
      date: '2023-10-27 15:45:00',
    },
  ]);

  return (
    <div className="ks-body ks-scrollable jspScrollable" data-auto-height="" data-reduce-height=".ks-footer" data-fix-height="32" style={{ height: '480px', overflow: 'hidden', padding: '0px', width: '701px' }} tabIndex="0">
      <div className="jspContainer" style={{ width: '701px', height: '481px' }}>
        <div className="jspPane" style={{ padding: '0px', top: '0px', width: '691px' }}>
          <ul className="ks-items">
            {messages.map((message) => (
              <li key={message.id} className={`ks-item ${message.sender === 'User A' ? 'ks-self' : 'ks-from'}`}>
                <span className={`ks-avatar ${message.sender === 'User A' ? 'ks-offline' : 'ks-online'}`}>
                  <img src="https://bootdey.com/img/Content/avatar/avatar1.png" width="36" height="36" className="rounded-circle" alt="User Avatar" />
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
        <div className="jspVerticalBar">
          <div className="jspCap jspCapTop"></div>
          <div className="jspTrack" style={{ height: '481px' }}>
            <div className="jspDrag" style={{ height: '206px' }}>
              <div className="jspDragTop"></div>
              <div className="jspDragBottom"></div>
            </div>
          </div>
          <div className="jspCap jspCapBottom"></div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
