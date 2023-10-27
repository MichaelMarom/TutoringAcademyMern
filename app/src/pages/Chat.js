import React, { useEffect, useState } from 'react';
import Chats from '../components/Chat/Chats';
import Messages from '../components/Chat/Messages';
import '../styles/chat.css'
import SendMessage from '../components/Chat/SendMessage';
import { Header } from '../components/Chat/Header';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedChat.name) navigate(`/chat/${selectedChat.name}`)
    }, [selectedChat])

    return (
        <div className="container">
            <div className="ks-page-content">
                <div className="ks-page-content-body">
                    <div className="ks-messenger">
                        <Chats setSelectedChat={setSelectedChat} />
                        {/* </div> */}
                        <div className="ks-messages ks-messenger__messages">
                            {selectedChat.name && <Header />}
                            {selectedChat.name && <Messages chatId={selectedChat.id} />}
                            {selectedChat.name && <SendMessage chatId={selectedChat.id} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
