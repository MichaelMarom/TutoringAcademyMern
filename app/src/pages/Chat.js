import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Chats from '../components/Chat/Chats';
import Messages from '../components/Chat/Messages';
import '../styles/chat.css'
import SendMessage from '../components/Chat/SendMessage';
import { Header } from '../components/Chat/Header';
import { useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import { NoChatSelectedScreen } from '../components/Chat/NoChatSelectedScreen';
import { isEqualTwoObjectsRoot } from '../helperFunctions/generalHelperFunctions';
import { useSelector } from 'react-redux';
const discussionData = [
    {
        name: 'Eric George',
        datetime: 'just now',
        message: "Why didn't he come and talk to me...",
        avatarSrc: 'https://bootdey.com/img/Content/avatar/avatar2.png',
        unread: true,
    },
    {
        name: 'Naomi',
        datetime: 'just now',
        message: "Prepare dinner.",
        avatarSrc: 'https://bootdey.com/img/Content/avatar/avatar2.png',
        unread: true,
    },
    {
        name: 'Farhan',
        datetime: 'just now',
        message: "lets go for shopping",
        avatarSrc: 'https://bootdey.com/img/Content/avatar/avatar2.png',
        unread: true,
    },
]

function Chat() {
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    const params = useParams();
    const { shortlist } = useSelector(state => state.shortlist);
    const [chats, setChats] = useState([]);
    const { student } = useSelector(state => state.student);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: student.FirstName,
            text: 'Hello, how are you?',
            userId: student.AcademyId,
            status: 'sent',
            image: null,
            video: null,
            audio: null,
            referenceMessageId: null,
            date: '2023-10-27 15:30:00',
        },
        {
            id: 2,
            sender: selectedChat.name,
            text: 'I am doing well, thanks!',
            userId: selectedChat.id,
            status: 'delivered',
            image: 'https://example.com/image1.jpg',
            video: null,
            audio: null,
            referenceMessageId: null,
            date: '2023-10-27 15:35:00',
        },
        {
            id: 3,
            sender: student.FirstName,
            text: 'That\'s great to hear.',
            userId: student.AcademyId,
            status: 'read',
            image: null,
            video: 'https://example.com/video1.mp4',
            audio: null,
            referenceMessageId: 1,
            date: '2023-10-27 15:40:00',
        },
        {
            id: 4,
            sender: selectedChat.name,
            text: 'Yes, it is. Here\'s a video of it.',
            userId: selectedChat.id,
            status: 'sent',
            image: null,
            video: null,
            audio: 'https://example.com/audio1.mp3',
            referenceMessageId: 3,
            date: '2023-10-27 15:45:00',
        },
    ])


    useEffect(() => {
        const extractedChats = shortlist.map(item => ({
            id: item.tutorData.AcademyId,
            name: `${item.tutorData.FirstName} ${item.tutorData.LastName}`,
            avatarSrc: item.tutorData.Photo,
            unread: false,
        }));
        setChats(extractedChats)
    }, [shortlist])

    useEffect(() => {
        if (selectedChat.name) {
            const currentPath = `/student/chat/${selectedChat.name}`;
            navigate(currentPath);
        }
    }, [navigate, selectedChat.name]);

    useEffect(() => {
        const foundChat = chats.find(chat => chat.name === params.name) || {};
        setSelectedChat(foundChat);
    }, [params.name, shortlist]);

    return (
        <StudentLayout showLegacyFooter={false}>
            <div className="container" style={{ height: "100vh" }}>
                <div className="ks-page-content">
                    <div className="ks-page-content-body">
                        <div className="border ks-messenger shadow">
                            <Chats setSelectedChat={setSelectedChat} discussionData={chats} />
                            <div className="ks-messages  ks-messenger__messages">
                                {!selectedChat.name && <NoChatSelectedScreen />}
                                {selectedChat.name && <Header selectedChat={selectedChat} />}
                                {selectedChat.name && <Messages selectedChat={selectedChat} messages={messages} />}
                                {selectedChat.name && <SendMessage selectedChat={selectedChat} messages={messages} setMessages={setMessages} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

export default Chat;
