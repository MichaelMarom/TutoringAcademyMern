import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../../helperFunctions/generalHelperFunctions';

function SendMessage({ selectedChat, setMessages, messages, sendMessage }) {
  const [text, setText] = useState('');

  const handleSendMessage = () => {
    setText('');
    sendMessage(text)
  }

  return (
    <div className="input-group border-top ">
      <input type="text" className="form-control m-0 border-0" placeholder="Type Message...."
        onChange={(e) => setText(e.target.value)} value={text} />
      <button className="btn btn-outline-success m-0" type="button"
        onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default SendMessage;
