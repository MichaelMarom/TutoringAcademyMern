import React, { useState } from 'react';

function SendMessage({ chatId }) {
  const [text, setText] = useState('');

  const handleSendMessage = () => {
    if (text.trim() !== '') {
      // Send the message to the selected chat
      // You can update the messages state or send the message to a server
      setText('');
    }
  }

  return (
    <div className="send-message-container">
      <input
        type="text"
        className="form-control"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

export default SendMessage;
