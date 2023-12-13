import React, { useEffect, useRef, useState } from 'react';
import Chats from '../components/Chat/Chats';
import Messages from '../components/Chat/Messages';
import '../styles/chat.css'
import SendMessage from '../components/Chat/SendMessage';
import { Header } from '../components/Chat/Header';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommonLayout from '../layouts/CommonLayout';
import { NoChatSelectedScreen } from '../components/Chat/NoChatSelectedScreen';
import { useSelector } from 'react-redux';
import { get_chat_message, post_message } from '../axios/chat';
import { capitalizeFirstLetter } from '../helperFunctions/generalHelperFunctions';
import { socket } from '../socket'

function Chat() {
    const [selectedChat, setSelectedChat] = useState({});
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation()
    const { shortlist } = useSelector(state => state.shortlist);
    const { student } = useSelector(state => state.student);
    const { tutor } = useSelector(state => state.tutor);
    const studentLoggedIn = location.pathname.split('/')[1] === 'student';
    const loggedInUserDetail = studentLoggedIn ? student : tutor;
    const { chats } = useSelector(state => state.chat)
    const [messages, setMessages] = useState([])
    const [arrivalMsg, setArrivalMsg] = useState(null);
    const [fetchingMessages, setFetchingMessages] = useState(false)
    // const [renderComponent, setRenderComponent] = useState(true);
    const [dbMessages, setDbMessages] = useState([])

    useEffect(() => {

        if (loggedInUserDetail.AcademyId && selectedChat.id) {
            socket.emit("add-user", selectedChat.id);
        }

    }, [loggedInUserDetail, selectedChat.id]);

    const sendMessage = async (text) => {
        if (text.trim() !== '') {
            const newMessage = {
                name: `${capitalizeFirstLetter(loggedInUserDetail.FirstName)} ${capitalizeFirstLetter(loggedInUserDetail.LastName)}`,
                senderId: loggedInUserDetail.AcademyId,
                date: new Date(),
                text,
                photo: loggedInUserDetail.Photo,
                to: selectedChat.AcademyId,
                room: selectedChat.id
            }
            setMessages([...messages, newMessage]);
            const body = {
                Text: text,
                Date: new Date(),
                Sender: loggedInUserDetail.AcademyId,
                ChatID: selectedChat.id
            };

            await post_message(body)
            delete newMessage.photo;
            socket.emit("send-msg", newMessage);
        }
    }

    //// console.log(selectedChat)
    useEffect(() => {
        arrivalMsg && setMessages((prev) => [...prev, arrivalMsg]);
    }, [arrivalMsg]);

    useEffect(() => {
        if (socket) {
            socket.on("msg-recieve", (msgObj) => {
                // console.log('msg-rec2')
                setArrivalMsg(msgObj);
            });
        }
    }, []);



    useEffect(() => {
        setFetchingMessages(true);
        const getMessages = async () => {
            if (params.id) {
                const data = await get_chat_message(params.id);
                setMessages(data);
            }
            setFetchingMessages(false);
        };

        getMessages();
    }, [navigate, params.id, studentLoggedIn, dbMessages]);

    useEffect(() => {
        if (selectedChat.id) {
            const currentPath = `/${studentLoggedIn ? 'student' : 'tutor'}/chat/${selectedChat.id}`;
            navigate(currentPath);
        }
    }, [selectedChat.id, navigate, studentLoggedIn])

    useEffect(() => {
        // eslint-disable-next-line
        const foundChat = chats.find(chat => chat.id == params.id) || {};
        setSelectedChat(foundChat);

    }, [params.id, shortlist, chats]);

    return (
        <CommonLayout role={studentLoggedIn ? 'student' : 'tutor'} showLegacyFooter={false}>
            <div className="container" style={{ height: "100vh" }}>
                <div className="ks-page-content">
                    <div className="ks-page-content-body">
                        <div className="border ks-messenger shadow">
                            <Chats
                                setSelectedChat={setSelectedChat}
                                fetchingMessages={fetchingMessages}
                                discussionData={chats}
                                selectedChat={selectedChat}
                            />
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
