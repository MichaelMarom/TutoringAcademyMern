import React, { useState } from 'react';
import Chats from './Chats';

function MessageBox() {
  const [selectedChat, setSelectedChat] = useState({});

  return (
    <div className="container">
      <Chats selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
    </div>
  );
}

export default MessageBox;
