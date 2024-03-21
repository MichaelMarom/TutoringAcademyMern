import { useEffect, useState } from 'react';
import screenLarge from '../../../images/screen-full-svgrepo-com.svg';
import screenNormal from '../../../images/screen-normal-svgrepo-com.svg'
import muteSvg from '../../../images/mute-svgrepo-com.svg'
import DiableVideoImage from '../../../images/video-recorder-off-svgrepo-com.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../../config/socket';
import { Peer } from 'peerjs';
import FlipCountdown from '@rumess/react-flip-countdown';
import { moment } from '../../../config/moment'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const TutorAside = () => {
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

    let [visuals, setVisuals] = useState(true)
    const { tutor } = useSelector(state => state.tutor);

    useEffect(() => {
        if (socket) {
            socket.on("session-msg-recieve", (msgObj) => {
                setArrivalMsg(msgObj);
            });
        }
    }, [])

    // Calculate time remaining
    useEffect(() => {
        if (currentSession.end) {
            const currentTime = new Date();
            const remainingTime = Math.max(0, Math.floor((new Date(currentSession.end).getTime() - currentTime) / 1000));
            setTimeRemaining(remainingTime);
        }
    }, [currentSession.end]);


    useEffect(() => {
        arrivalMsg && arrivalMsg.sessionId === params.id && setMessages((prev) => [...prev, { ...arrivalMsg }]);
    }, [arrivalMsg, params]);

    useEffect(() => {
        // if (loggedInUserDetail.AcademyId && selectedChat.id) {
        params.id && tutor.AcademyId && socket.emit("session-add-user", params.id);
        // }

    }, [tutor, params]);

    const sendMessage = async () => {
        let text = mssg
        setMssg('')
        if (text.trim() !== '') {
            const newMessage = {
                sessionId: params.id,
                userId: tutor.AcademyId || student.AcademyId,
                date: new Date(),
                text,
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
        visuals.getVideoTracks()[0].enabled =
        !(visuals.getVideoTracks()[0].enabled);
        if (e.target.hasAttribute('id')) {
            e.target?.removeAttribute('id')
        } else {
            e.target?.setAttribute('id', 'collab-action')
        }
    }

    let handleAudioActions = e => {
        visuals.getAudioTracks()[0].enabled =
            !(visuals.getAudioTracks()[0].enabled);

        if (e.target.hasAttribute('id')) {
            e.target?.removeAttribute('id')
        } else {
            e.target?.setAttribute('id', 'collab-action')
        }
    }

    useEffect(() => {

        let myVideo = document.querySelector('.tutor-video-tab');
        let room_id = '1234567890asdfghjkl';
        let peer = new Peer(undefined, {});

        peer.on('open', id => {
            socket.emit('join-room', room_id, id);
        })

        const peers = {}

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
        .catch(e => console.log(e));

        socket.on('user-disconnected', user_id => {
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
            console.log(stream)

            video.srcObject = stream
            setVideoLoader('Connecting...')
            video.addEventListener('loadedmetadata', () => {
                // playSound();
                video.play()
                setVideoLoader('')
            })
        }

        
    }, [location])

    // const handleTimeUp = () => {
    //     toast.warning('Session Time is ended!');
    //     navigate(`/tutor/setup`)
    // }

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

    return (
        <div className="TutorAside shadow-sm" style={{ top: "37%", width: "16rem" }}>

            {currentSession.subject ?
                <div className='text-center countdown'>
                    <CountdownCircleTimer
                        isPlaying
                        duration={timeRemaining}
                        size={90}
                        isSmoothColorTransition={false}
                        strokeWidth={13}
                        colors={['#FFA500', '#32CD32', '#ff0000', '#ff0000']}
                        colorsTime={[53 * 60, 50 * 60, 3 * 60, 0]}
                    >
                        {children}
                    </CountdownCircleTimer>
                    {/* <FlipCountdown
                    size={'small'}
                    hideDay
                    hideHour
                    hideMonth
                    hideYear
                    minuteTitle='Minutes'
                    secondTitle='Seconds'
                    endAtZero
                    onTimeUp={handleTimeUp}
                    endAt={moment().add('minutes', 53).toDate()} /> */}
                </div> :
                <div className='text-center countdown'>
                    <CountdownCircleTimer
                        isPlaying
                        duration={0}
                        size={90}
                        isSmoothColorTransition={false}
                        strokeWidth={13}
                        colors={['#FFA500', '#32CD32', '#ff0000', '#ff0000']}
                        colorsTime={[53 * 60, 50 * 60, 3 * 60, 0]}
                    >
                        {children}
                    </CountdownCircleTimer>
                </div>
            }

            <div className="TutorAsideVideoCnt">
                <video className='tutor-video-tab'>
                </video>
                <ul>
                    <li className="video-size"
                        style={{ background: '#efefef', opacity: '.4', padding: '5px', borderRadius: '8px' }} onClick={handleVideoResize}>
                        <img src={screenType}
                            style={{ height: '20px', width: '20px' }} alt="..." />
                    </li>
                    <li className="disable-visuals" onClick={e => handleVidActions(e)}>
                        <img src={DiableVideoImage} style={{ height: '25px', width: '25px' }} alt="..." />

                    </li>

                    <li className="disable-visuals" onClick={e => handleAudioActions(e)}>
                        <img src={muteSvg} style={{ height: '25px', width: '25px' }} alt="..." />

                    </li>
                </ul>
            </div>

            <div className="TutorAsideChatCnt" style={{ background: 'rgb(225 238 242)', height: "100%" }}>
                <div className="TutorAsideChatBox" style={{ background: 'rgb(225 238 242)' }}>

                    {messages.map(msg => <div className="TutorMessageCnt">
                        <div className='TutorMessageCntContent' style={{ padding: "4px" }}>
                            {msg.text}
                        </div>
                    </div>)
                    }

                </div>
                <div className="TutorAsideChatControl" style={{ background: 'rgb(225 238 242)' }}>
                    <span style={{ width: '80%', height: '80%', float: 'left', background: '#fff' }}>

                        <textarea type="text" id='TutorChatTextarea'
                            style={{
                                width: '100%', borderRadius: '5px', border: 'none', display: 'flex',
                                alignItems: 'center', background: '#f9f9f9', height: '40px', padding: '10px 5px 5px 5px', fontFamily: 'serif', fontSize: 'medium', outline: 'none', resize: 'none'
                            }} onInput={e => setMssg(e.target.value)} value={mssg}
                            placeholder='Type Your Message Here'></textarea>

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