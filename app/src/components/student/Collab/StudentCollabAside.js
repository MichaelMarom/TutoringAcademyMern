import { useEffect, useState } from 'react';
import screenLarge from '../../images/screen-full-svgrepo-com.svg';
import screenNormal from '../../images/screen-normal-svgrepo-com.svg'
import DiableVideoImage from '../../images/video-recorder-off-svgrepo-com.svg';
import muteSvg from '../../images/mute-svgrepo-com.svg'
import { socket } from '../../../config/socket';
import { Peer } from 'peerjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { moment } from '../../../config/moment'
import FlipCountdown from '@rumess/react-flip-countdown';
import { toast } from 'react-toastify'
import { MdCancel } from "react-icons/md";
import Tooltip from '../../common/ToolTip';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';


const StudentAside = () => {
    const navigate = useNavigate()
    let [mssg, setMssg] = useState('');
    let [mssgList, setMssgList] = useState([]);
    let location = useLocation();
    let [peerId, setPeerId] = useState('')
    let [videoLoader, setVideoLoader] = useState('');
    let [screenType, setScreenType] = useState(screenLarge);
    const [showCounter, setShowCOunter] = useState(true)
    let [visuals, setVisuals] = useState(true)

    let handleVideoResize = e => {
        let element = document.querySelector('.StudentAsideVideoCnt');
        if (element.hasAttribute('id')) {
            element?.removeAttribute('id')
            setScreenType(screenLarge)
        } else {
            element?.setAttribute('id', 'StudentAsideVideoCnt')
            setScreenType(screenNormal)

        }
    }

    let handleVidActions = e => {

        visuals.getVideoTracks()[0].enabled =
            !(visuals.getVideoTracks()[0].enabled);
        /*navigator.mediaDevices.getUserMedia()
        .then((mediaStream) => {
            mediaStream.getVideoTracks()[0].enabled =
            !(mediaStream.getVideoTracks()[0].enabled);
        })*/

        if (e.target.hasAttribute('id')) {
            e.target?.removeAttribute('id')
        } else {
            e.target?.setAttribute('id', 'collab-action')
        }


    }

    let handleAudioActions = e => {

        visuals.getAudioTracks()[0].enabled =
            !(visuals.getAudioTracks()[0].enabled);
        /*navigator.mediaDevices.getUserMedia()
        .then((mediaStream) => {
            mediaStream.getVideoTracks()[0].enabled =
            !(mediaStream.getVideoTracks()[0].enabled);
        })*/

        if (e.target.hasAttribute('id')) {
            e.target?.removeAttribute('id')
        } else {
            e.target?.setAttribute('id', 'collab-action')
        }

    }

    useEffect(() => {


        let myVideo = document.querySelector('.student-video-tab');
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
                video.play()
                setVideoLoader('')
            })
        }


    }, [location, peerId])

    let handleChat = e => {
        if (mssg !== null) {
            let mssg_cnt =

                <div className="StudentMessageCnt">
                    <div className='StudentMessageCntContent'>
                        {mssg}
                    </div>
                </div>

            setMssgList(item => [...item, mssg_cnt])
            document.querySelector('#StudentChatTextarea').value = '';

        }

    }

    const handleTimeUp = () => {
        toast.warning('Session Time is Up!');
        navigate(`/student/feedback`)
    }

    const children = ({ remainingTime }) => {
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60

        return (<div>
            {minutes <= 49 && <p className='m-0' style={{ fontSize: "12px" }}>Lesson</p>}

            {minutes}:{seconds}
            {(minutes <= 49 && minutes > 3) && <p className='m-0' style={{ fontSize: "12px" }}>Started</p>}
            {minutes <= 3 && <p className='m-0 blinking-button text-danger' style={{ fontSize: "12px" }}>Ending</p>}


        </div>)
    }

    return (
        <>
            <div className="StudentAside">

                <div className='text-center countdown'>
                    <CountdownCircleTimer
                        isPlaying
                        duration={53 * 60}
                        size={90}
                        strokeWidth={13}
                        isSmoothColorTransition={false}
                        colors={['#FFFF00', '#32CD32', '#ff0000', '#ff0000']}
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
                </div>
                {/* {showCounter ? <div className='d-flex justify-content-between align-items-start border shadow p-2 rounded'>
                    <div>
                        <FlipCountdown
                            size={'small'}
                            hideDay
                            hideHour
                            hideMonth
                            hideYear
                            minuteTitle='.'
                            secondTitle='.'
                            endAtZero
                            onTimeUp={handleTimeUp}
                            endAt={moment().add('minutes', 53).toDate()} />
                    </div>
                    <div>
                        <button onClick={() => setShowCOunter(false)} className='btn btn-secondary m-0'> Hide Counter</button>
                   
                    </div>
                </div>
                    :
                    <button onClick={() => setShowCOunter(true)} className='btn btn-secondary'> Show Counter</button>
                } */}



                <div className="StudentAsideVideoCnt">
                    <video className='student-video-tab'>
                    </video>
                    <ul>
                        <li className="video-size" style={{ background: '#efefef', opacity: '.4', padding: '5px', borderRadius: '8px' }} onClick={handleVideoResize}>
                            <img src={screenType} style={{ height: '20px', width: '20px' }} alt="..." />
                        </li>
                        <li className="disable-visuals" onClick={e => handleVidActions(e)}>
                            <img src={DiableVideoImage} style={{ height: '25px', width: '25px' }} alt="..." />
                        </li>

                        <li className="disable-visuals" onClick={e => handleAudioActions(e)}>
                            <img src={muteSvg} style={{ height: '25px', width: '25px' }} alt="..." />

                        </li>
                    </ul>
                </div>


                <div className="StudentAsideChatCnt" style={{ background: 'rgb(225 238 242)' }}>
                    <div className="StudentAsideChatBox" style={{ background: 'rgb(225 238 242)' }}>
                        {
                            mssgList
                        }
                    </div>
                    <div className="StudentAsideChatControl" style={{ background: 'rgb(225 238 242)' }}>
                        <span style={{ width: '80%', height: '80%', float: 'left', background: '#fff' }}>

                            <textarea type="text" id='StudentChatTextarea' style={{ width: '100%', borderRadius: '5px', border: 'none', display: 'flex', alignItems: 'center', background: '#f9f9f9', height: '40px', padding: '10px 5px 5px 5px', fontFamily: 'serif', fontSize: 'medium', outline: 'none', resize: 'none' }} onInput={e => setMssg(e.target.value)} placeholder='Type Your Message Here'></textarea>

                        </span>
                        <span style={{ width: '20%', height: '70%', float: 'right', background: '#fff' }}>
                            <button className='btn btn-success m-0 p-0' style={{ height: '40px', width: '90%' }} onClick={handleChat}>
                                send
                            </button>
                        </span>
                    </div>
                </div>

            </div >
        </>
    );
}

export default StudentAside;