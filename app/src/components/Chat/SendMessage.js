import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function SendMessage({ selectedChat, setMessages, messages }) {
  const [text, setText] = useState('');
  const { student } = useSelector(state => state.student)

  const handleSendMessage = () => {
    if (text.trim() !== '') {
      setMessages([...messages, { sender: student.FirstName, userId: student.AcademyId, date: '12-03-23 12:00:03', text }])
      setText('');
    }
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
