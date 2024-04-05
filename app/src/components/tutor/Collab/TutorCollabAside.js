import { useEffect, useRef, useState } from 'react';
import screenLarge from '../../../images/screen-full-svgrepo-com.svg';
import screenNormal from '../../../images/screen-normal-svgrepo-com.svg'
import muteSvg from '../../../images/mute-svgrepo-com.svg'
import DiableVideoImage from '../../../images/video-recorder-off-svgrepo-com.svg';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { socket } from '../../../config/socket';
import { Peer } from 'peerjs';
import FlipCountdown from '@rumess/react-flip-countdown';
import { moment } from '../../../config/moment'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaCamera, FaMicrophone } from 'react-icons/fa';
import { RiCameraOffFill, RiContactsBookLine } from "react-icons/ri";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { BiChat } from 'react-icons/bi';
import { getSessionDetail } from '../../../axios/tutor';

const TutorAside = ({ openedSession, sessionTime }) => {
    const navigate = useNavigate();
    const { upcomingSessionFromNow: tutorUpcomingFromNow,
        upcomingSession: tutorUpcoming,
        inMins: isTutorUpcomgLessonInMins, currentSession: tutorCurrentSession } = useSelector(state => state.tutorSessions)
    const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.studentSessions)

    const [messages, setMessages] = useState([])
    const [arrivalMsg, setArrivalMsg] = useState(null);
    const { student } = useSelector(state => state.student)
    const [timeRemaining, setTimeRemaining] = useState(new Date())

    let [mssg, setMssg] = useState('');
    const params = useParams();
    let [mssgList, setMssgList] = useState([]);
    let location = useLocation();
    let [peerId, setPeerId] = useState('')
    let [videoLoader, setVideoLoader] = useState('');
    let [screenType, setScreenType] = useState(screenLarge);
    const chatContainer = useRef(null);
    let [visuals, setVisuals] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const { tutor } = useSelector(state => state.tutor);
    const { user } = useSelector(state => state.user)
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('sessionId')

    /**
     * validate id
     * get session
     * check its date and see its time in future/past/current
     * show message accordingly
     * if current session, then show collabs, 
     * if user visit /collab with no sessionId, then we show live session link, he can click and collab
     * 
     */

    const scrollToBottom = () => {
        if (chatContainer.current) {
            chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.on("session-msg-recieve", (msgObj) => {
                setArrivalMsg(msgObj);
            });
        }
    }, [])

    // Calculate time remaining
    useEffect(() => {
        if (openedSession.end && sessionTime === 'current') {
            const currentTime = new Date();
            const remainingTime = Math.max(0, Math.floor((new Date(openedSession.end).getTime() - currentTime) / 1000));
            setTimeRemaining(remainingTime);
        }
    }, [openedSession.end]);
    console.log(timeRemaining, openedSession.end, sessionTime)

    useEffect(() => {
        sessionTime === 'current' && arrivalMsg && arrivalMsg.sessionId === sessionId && setMessages((prev) => [...prev, { ...arrivalMsg }]);
    }, [arrivalMsg, sessionId, sessionTime]);

    useEffect(() => {
        sessionTime === 'current' && sessionId && tutor.AcademyId && socket.emit("session-add-user", sessionId);
    }, [tutor, sessionId, sessionTime]);

    const sendMessage = async () => {
        if (!sessionId || sessionTime !== 'current') return toast.info('Session need to be live to send messages!')
        let text = mssg
        setMssg('')
        if (text.trim() !== '') {
            const newMessage = {
                sessionId,
                userId: tutor.AcademyId || student.AcademyId,
                date: new Date(),
                text,
                name: tutor.TutorScreenname || student.ScreenName,
                isStudent: user.role === 'student'
            }
            setMessages([...messages, newMessage]);
            // const body = {
            //     Text: text,
            //     Date: new Date(),
            //     Sender: loggedInUserDetail.AcademyId,
            //     ChatID: selectedChat.id
            // };

            // await post_message(body)
            // delete newMessage.photo;
            socket.emit("session-send-msg", newMessage);
        }
    }

    let handleVideoResize = e => {
        let element = document.querySelector('.TutorAsideVideoCnt');
        if (element.hasAttribute('id')) {
            element?.removeAttribute('id')
            setScreenType(screenLarge)
        } else {
            element?.setAttribute('id', 'TutorAsideVideoCnt')
            setScreenType(screenNormal)
        }
    }

    let handleVidActions = e => {
        if (typeof visuals.getVideoTracks === 'function') {
            visuals.getVideoTracks()[0].enabled = !(visuals.getVideoTracks()[0].enabled);
            setVideoEnabled(!videoEnabled)
        }
        else toast.info('Please Enable Camera from Browser Settings!')
    }

    let handleAudioActions = e => {
        if (typeof visuals.getAudioTracks === 'function') {
            visuals.getAudioTracks()[0].enabled =
                !(visuals.getAudioTracks()[0].enabled);

            setAudioEnabled(!audioEnabled)
        }
        else toast.info('Please Enable MicroPhone from Browser Settings!')
    }

    useEffect(() => {

        let myVideo = document.querySelector('.tutor-video-tab');
        let room_id = '1234567890asdfghjkl';
        let peer = new Peer(undefined, {});

        peer.on('open', id => {
            socket.emit('join-room', room_id, id);
        })

        const peers = {}
        console.log('above nav', navigator.mediaDevices)
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
            .then(stream => {
                setVisuals(stream)
                addVideoStream(myVideo, stream);
                peer.on('call', call => {
                    let file = visuals ? stream : '';
                    setVideoLoader('Connecting...')
                    call.answer(file)
                    call.on('stream', userVideoStream => {
                        setVideoLoader('')
                        addVideoStream(myVideo, userVideoStream)
                    })
                })

                socket.on('user-connected', user_id => {
                    connectToNewUser(user_id, stream)
                    peer.on('call', call => {
                        let file = visuals ? stream : '';
                        setVideoLoader('Connecting...')
                        call.answer(file)
                        call.on('stream', userVideoStream => {
                            addVideoStream(myVideo, userVideoStream)
                        })
                    })
                })
            })
            .catch(e => {
                console.log(e)
                // toast.warning(e.message)
            });

        socket && socket.on('user-disconnected', user_id => {
            if (peers[user_id]) peers[user_id].close()
        })

        peer.on('open', id => {
            socket.emit('join-room', room_id, id)
        })

        function connectToNewUser(userId, stream) {
            const call = peer.call(userId, stream);
            setVideoLoader('Connecting...')
            call.on('stream', userVideoStream => {
                // playSound();
                addVideoStream(myVideo, userVideoStream)
            })

            call.on('close', () => {
                myVideo.src = ''
            })

            peers[userId] = call
        }

        function addVideoStream(video, stream) {
            video.srcObject = stream
            setVideoLoader('Connecting...')
            video.addEventListener('loadedmetadata', () => {
                // playSound();
                video.play()
                setVideoLoader('')
            })
        }

    }, [location])

    const children = ({ remainingTime }) => {

        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60

        return (
            <div>
                {minutes <= 49 && <p className='m-0' style={{ fontSize: "12px" }}>Lesson</p>}
                {minutes}:{seconds}
                {(minutes <= 49 && minutes > 3) && <p className='m-0' style={{ fontSize: "12px" }}>Started</p>}
                {(minutes <= 3 && minutes !== 0) && <p className='m-0 blinking-button text-danger' style={{ fontSize: "12px" }}>Ending</p>}
                {minutes === 0 && <p className='m-0 text-danger' style={{ fontSize: "12px" }}>Ended</p>}
            </div>
        )
    }

    const startingClockChildren = ({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60

        return (
            <div>
                {minutes <= 49 && <p className='m-0' style={{ fontSize: "12px" }}>Lesson</p>}
                {minutes}:{seconds}
                <p className='m-0 blinking-button text-danger'
                    style={{ fontSize: "12px" }}>Starting</p>
            </div>
        )
    }

    return (
        <div className="shadow-sm" style={{ width: "100%", height: "78vh" }}>
            {(openedSession.subject && !sessionTime === 'current') ?
                timeRemaining < (57 * 60) ?
                    <div className='text-center countdown p-1 m-0'>
                        <CountdownCircleTimer
                            isPlaying
                            initialRemainingTime={timeRemaining}
                            duration={50 * 60}
                            size={90}
                            isSmoothColorTransition={false}
                            strokeWidth={13}
                            colors={['#32CD32', '#ff0000', '#ff0000']}
                            colorsTime={[50 * 60, 3 * 60, 0]}
                        >
                            {children}
                        </CountdownCircleTimer>

                    </div>
                    : <div className='text-center countdown p-1 m-0'>
                        <CountdownCircleTimer
                            isPlaying
                            duration={3 * 60}
                            colors='#FFA500'
                            size={90}
                            isSmoothColorTransition={false}
                            strokeWidth={13}
                        >
                            {startingClockChildren}
                        </CountdownCircleTimer>
                    </div>
                : <div className='text-center countdown p-1 m-0'>
                    <CountdownCircleTimer
                        isPlaying
                        duration={0}
                        colors='#FFA500'
                        size={90}
                        isSmoothColorTransition={false}
                        strokeWidth={13}
                    >
                        {children}
                    </CountdownCircleTimer>
                </div>
            }

            <div className="TutorAsideVideoCnt">
                {videoLoader}
                <video className='tutor-video-tab'>
                </video>
                <ul>
                    <li className="video-size"
                        style={{ background: '#efefef', opacity: '.4', padding: '5px', borderRadius: '8px' }}
                        onClick={handleVideoResize}>
                        <img src={screenType}
                            style={{ height: '20px', width: '20px' }} alt="..." />
                    </li>
                    <li onClick={e => handleVidActions(e)} style={{ borderRadius: "50%", backgroundColor: "white", opacity: "0.7" }} >
                        {videoEnabled ? <FaCamera color="black" /> : <RiCameraOffFill />}
                    </li>

                    <li onClick={e => handleAudioActions(e)} style={{ borderRadius: "50%", backgroundColor: "white", opacity: "0.7" }} >
                        {audioEnabled ? <FaMicrophone color="black" /> : <PiMicrophoneSlashFill />}
                    </li>
                </ul>
            </div>

            <div className="TutorAsideChatCnt"
                style={{ background: 'rgb(225 238 242)', height: "53%" }}>
                <div className="TutorAsideChatBox" ref={chatContainer} style={{ background: 'rgb(225 238 242)' }}>
                    {messages.map(msg => <div className="" style={{
                        width: "100%",
                        height: "fit-content",
                        display: "flex",
                        justifyContent: "right",
                        position: "relative",
                        margin: "0 0 8px 0",
                    }}>
                        <div className='d-flex flex-column' style={{
                            maxWidth: "80%",
                            textAlign: "left",
                            padding: "10px 15px",
                            float: "right",
                            position: "relative",
                            borderTopLeftRadius: "15px",
                            borderTopRightRadius: "15px",
                            borderBottomRightRadius: "1.15px",
                            borderBottomLeftRadius: "15px",
                            backgroundColor: msg.isStudent ? "green" : "#0062ff",
                            color: "#fff",
                            padding: "4px",
                            // height: "200px"
                        }}>
                            <div style={{ fontSize: "13px", color: "lightgray" }}>
                                {/* {msg.name} */}
                            </div>
                            <div>
                                {msg.text}
                            </div>
                        </div>
                    </div>)}
                </div>
                <div className="TutorAsideChatControl" style={{ background: 'rgb(225 238 242)' }}>
                    <span style={{ width: '80%', height: '80%', float: 'left', background: '#fff' }}>

                        <textarea type="text" id='TutorChatTextarea'
                            style={{
                                width: '100%', borderRadius: '5px', border: 'none', display: 'flex',
                                alignItems: 'center', background: '#f9f9f9', height: '40px', padding: '10px 5px 5px 5px', fontFamily: 'serif', fontSize: 'medium', outline: 'none', resize: 'none'
                            }} onInput={e => setMssg(e.target.value)} value={mssg}
                            placeholder='Type Your Message Here'

                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter key was pressed without Shift
                                    e.preventDefault(); // Prevent default behavior (new line)
                                    sendMessage(); // Call sendMessage function
                                }
                            }}></textarea>
                    </span>
                    <span style={{ width: '20%', height: '70%', float: 'right', background: '#fff' }}>
                        <button className="btn btn-success p-0 m-0"
                            style={{ height: '40px', width: '90%' }} onClick={sendMessage}>
                            send
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TutorAside;