import React, { useEffect, useState } from 'react';
import Chats from '../components/Chat/Chats';
import Messages from '../components/Chat/Messages';
import '../styles/chat.css'
import SendMessage from '../components/Chat/SendMessage';
import { Header } from '../components/Chat/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonLayout from '../layouts/CommonLayout';
import { NoChatSelectedScreen } from '../components/Chat/NoChatSelectedScreen';
import { useSelector } from 'react-redux';
import { get_chats, get_chat_message, post_message } from '../axios/chat';
import { capitalizeFirstLetter } from '../helperFunctions/generalHelperFunctions';
import { socket } from '../socket';


function Chat() {
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation()
    const { shortlist } = useSelector(state => state.shortlist);
    const [chats, setChats] = useState([]);
    const { student } = useSelector(state => state.student);
    const { tutor } = useSelector(state => state.tutor);
    const studentLoggedIn = location.pathname.split('/')[1] === 'student';
    const loggedInUserDetail = studentLoggedIn ? student : tutor;
    console.log(tutor, location, studentLoggedIn)
    const [messages, setMessages] = useState([])
    const [fetchingMessages, setFetchingMessages] = useState(false)

    const sendMessage = async (text) => {
        if (text.trim() !== '') {
            socket.emit('chat message', {
                name: `${capitalizeFirstLetter(loggedInUserDetail.FirstName)} ${capitalizeFirstLetter(loggedInUserDetail.LastName)}`,
                senderId: loggedInUserDetail.AcademyId,
                date: new Date(),
                text,
                photo: loggedInUserDetail.Photo
            });
            setMessages([...messages, {
                name: `${capitalizeFirstLetter(loggedInUserDetail.FirstName)} ${capitalizeFirstLetter(loggedInUserDetail.LastName)}`,
                senderId: loggedInUserDetail.AcademyId,
                date: new Date(),
                text,
                photo: loggedInUserDetail.Photo
            }]);
            const body = {
                Text: text,
                Date: new Date(),
                Sender: loggedInUserDetail.AcademyId,
                ChatID: selectedChat.id
            }
            const data = await post_message(body)
            console.log(data)
        }
    }


    useEffect(() => {
        // Listen for incoming messages
        socket.on('chat message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);
    useEffect(() => {
        const getAllChats = async () => {
            if (loggedInUserDetail.AcademyId) {
                const data = await get_chats(loggedInUserDetail.AcademyId, studentLoggedIn ? 'student' : 'tutor');
                setChats(data)
            }
        }
        getAllChats();
    }, [shortlist])

    useEffect(() => {
        const getMessages = async () => {
            setFetchingMessages(true)
            if (selectedChat.id) {
                const currentPath = `/${studentLoggedIn ? 'student' : 'tutor'}/chat/${selectedChat.id}`;
                const data = await get_chat_message(selectedChat.id)
                console.log(data)
                setMessages(data)
                navigate(currentPath);
            }
            setFetchingMessages(false)
        }

        getMessages()
    }, [navigate, selectedChat.id, studentLoggedIn]);

    useEffect(() => {
        const foundChat = chats.find(chat => chat.id == params.id) || {};
        setSelectedChat(foundChat);
    }, [params.id, shortlist]);

    return (
        <CommonLayout role={studentLoggedIn ? 'student' : 'tutor'} showLegacyFooter={false}>
            <div className="container" style={{ height: "100vh" }}>
                <div className="ks-page-content">
                    <div className="ks-page-content-body">
                        <div className="border ks-messenger shadow">
                            <Chats setSelectedChat={setSelectedChat} discussionData={chats} />
                            <div className="ks-messages  ks-messenger__messages">
                                {!params.id && <NoChatSelectedScreen />}
                                {params.id && <Header selectedChat={selectedChat} />}
                                {params.id && <Messages selectedChat={selectedChat} messages={messages}
                                    fetchingMessages={fetchingMessages} />}
                                {params.id && <SendMessage selectedChat={selectedChat}
                                    messages={messages} setMessages={setMessages} sendMessage={sendMessage} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout>
    );
}

export default Chat;
