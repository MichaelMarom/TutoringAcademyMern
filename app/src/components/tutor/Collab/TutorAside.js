import React, { 
    useEffect, 
    useState 
} from 'react'


import { 
    socket 
} from '../../../config/socket';

import smallScrnSvg from '../../../assets/full-screen-exit-svgrepo-com.svg'
import fullScrnnSvg from '../../../assets/full-screen-svgrepo-com.svg'
import imgSvg from '../../../assets/image-document-svgrepo-com.svg'
import muteSvg from '../../../assets/mute-1-svgrepo-com.svg'
import noVideoSvg from '../../../assets/video-disabled-svgrepo-com.svg'
import js_ago from 'js-ago'
import { 
    Peer 
} from 'peerjs';

import { 
    useLocation 
} from 'react-router-dom';

export default function CollabAside() {

    let [fullScrn, setFullScrn] = useState(false)
    let [mute, setMute] = useState(false)
    let [videoMode, setVideoMode] = useState(false)

    let [videoLoader, setVideoLoader] = useState('');
    let [visuals, setVisuals ]= useState(true)

    let location = useLocation()

    let handleVidActions = () => {

        visuals.getVideoTracks()[0].enabled =
        !(visuals.getVideoTracks()[0].enabled);
        /*navigator.mediaDevices.getUserMedia()
        .then((mediaStream) => {
            mediaStream.getVideoTracks()[0].enabled =
            !(mediaStream.getVideoTracks()[0].enabled);
        })*/

       
    }

    let handleAudioActions = () => {

        visuals.getAudioTracks()[0].enabled =
        !(visuals.getAudioTracks()[0].enabled);
        /*navigator.mediaDevices.getUserMedia()
        .then((mediaStream) => {
            mediaStream.getVideoTracks()[0].enabled =
            !(mediaStream.getVideoTracks()[0].enabled);
        })*/

    }


    function handleVideoResize() {
        setFullScrn(!fullScrn);
        let videoCnt = document.querySelector('.video-cnt')
        if(fullScrn){
            videoCnt.style.height = '200px'
            videoCnt.style.width = '100%'
            videoCnt.style.position = 'relative'
            
        }else{
            videoCnt.style.height = '100%'
            videoCnt.style.width = '100%'
            videoCnt.style.position = 'fixed'
            videoCnt.style.left = '0'
            videoCnt.style.top = '0'

        }


    }

    function handleMute() {
        handleAudioActions()
        setMute(!mute)
        let muteBtn = document.querySelector('.mute-btn');
        if(mute){
            muteBtn.style.borderBottom = 'none'
        }else{
            muteBtn.style.borderBottom = '2px solid #fff'
        }
    }

    function handleVideoMode() {
        handleVidActions()
        setVideoMode(!videoMode)
        let videoBtn = document.querySelector('.videoMode-btn');
        if(videoMode){
            videoBtn.style.borderBottom = 'none'
        }else{
            videoBtn.style.borderBottom = '2px solid #fff'
        }
    }

    let chats = [
        {
            mssg: 'hello world my name is mike',
            date: '',
            mssg_id: '',
            sender: '1111'            
        },
        {
            mssg: 'ok nice to meet you',
            date: '',
            mssg_id: '',
            sender: ''            
        },
        {
            mssg: '',
            date: '',
            mssg_id: '',
            sender: ''            
        },
        {
            mssg: 'so what been on',
            date: '',
            mssg_id: '',
            sender: '1111'            
        },
        {
            mssg: 'nothing much, If a callback function is supplied, then an interval timer will be started with a frequency based upon the smallest unit',
            date: '',
            mssg_id: '',
            sender: ''            
        },
        {
            mssg: 'just working as usual',
            date: '',
            mssg_id: '',
            sender: ''            
        },
        {
            mssg: '',
            date: '',
            mssg_id: '',
            sender: '1111'            
        },
        {
            mssg: 'ok, great',
            date: '',
            mssg_id: '',
            sender: '1111'            
        }
    ]

   
    
    // Call the function to play the sound
    

    useEffect(() => {

        let myVideo = document.querySelector('.video-elem');
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
    
    return (
        <>
            <div className="collab-aside" style={styles.aside}>

                <div className='video-cnt' style={{
                    height: '200px',
                    width: '100%',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'right',
                    position: 'relative'
                    
                }}>
                    <video style={{
                        position: 'relative',
                        height: '100%',
                        width: '100%'
                    }}  className='video-elem'>
                    </video>
                    
                    

                    <div style={{
                        padding: '5px',
                        borderRadius: '5px',
                        background: '#fff',
                        // opacity: '.5',
                        height: '40px',
                        width: 'fit-content',
                        display: 'flex',
                        marginRight: '10px',
                        float: 'right',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: '10px',
                        backgroundColor: 'transparent'
                    }}>

                        {/* <button style={styles.li}>
                            
                            <img src={smallScrnSvg} style={{height: '15px', width: '15px'}} alt="" />
                        </button> */}
                        <button style={styles.li} onClick={handleVideoResize}>
                            
                            {
                                !fullScrn
                                &&
                                <img src={fullScrn} style={{height: '15px', width: '15px'}} alt="" />
                            }

                            {
                                fullScrn
                                &&
                                <img src={smallScrnSvg} style={{height: '15px', width: '15px'}} alt="" />
                            }
                        </button>
                        <button className='mute-btn' style={styles.li} onClick={handleMute}>
                            
                            <img src={muteSvg} style={{height: '15px', width: '15px'}} alt="" />
                        </button>
                        <button className='videoMode-btn' style={styles.li} onClick={handleVideoMode}>
                            
                            <img src={noVideoSvg} style={{height: '15px', width: '15px'}} alt="" />
                        </button>
        
                    </div>

                </div>

                <div style={{
                    height: 'calc(100% - 200px)',
                    width: '100%',
                    background: '#fff'
                }}>

                    <div className="aside-chat-body" style={{
                        height: 'calc(100% - 70px)',
                        padding: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto'

                    }}>

                        {
                            chats.map((item,index) => {
                                return(
                                    <div className="chat-cnt">
                                        {
                                            item.sender === '1111'
                                            ?
                                            <>
                                                
                                                {
                                                    item.mssg === ''
                                                    ?
                                                    <>
                                                        <div style={{
                                                            height: '200px',
                                                            width: '60%',
                                                            background: 'blue',
                                                            float: 'right',
                                                            padding: '5px',
                                                            marginBottom: '10px',
                                                            borderRadius: '5px'


                                                        }}>
                                                            <img src={imgSvg} style={{height: '100%', width: '100%'}} alt="" />

                                                            <div style={{
                                                                fontSize: 'x-small',
                                                                float: 'right',
                                                                color: '#000',
                                                                marginRight: '3px'

                                                                // background: 'green'
                                                            }}>{js_ago(new Date('2020-01-01'))}</div>
                                                        </div>

                                                    </>
                                                    :
                                                    <div className="my-chat-content">
                                                        <div style={{
                                                            background: 'blue',
                                                            padding: '5px',
                                                            borderTopRightRadius: '5px',
                                                            borderTopLeftRadius: '5px',
                                                            borderBottomRightRadius: '0',
                                                            borderBottomLeftRadius: '5px'
                                                        }}>{item.mssg}</div>
                                                        <div style={{
                                                            fontSize: 'x-small',
                                                            float: 'right',
                                                            color: '#000',
                                                            marginRight: '3px'

                                                            // background: 'green'
                                                        }}>{js_ago(new Date('2020-01-01'))}</div>
                                                    </div>
                                                }
                                                

                                            </>
                                            :
                                            <>
                                                
                                                {
                                                    item.mssg === ''
                                                    ?
                                                    <>
                                                        <div style={{
                                                                height: '200px',
                                                                width: '60%',
                                                                background: 'blue',
                                                                float: 'left',
                                                                padding: '5px',
                                                                marginBottom: '10px',
                                                                borderRadius: '5px'
                                                            }}>
                                                                <img src={imgSvg} style={{height: '100%', width: '100%'}} alt="" />
                                                                
                                                                <div style={{
                                                                    fontSize: 'x-small',
                                                                    float: 'left',
                                                                    color: '#000',
                                                                    marginRight: '3px'

                                                                    // background: 'green'
                                                                }}>{js_ago(new Date('2020-01-01'))}</div>
                                                        </div>
                                                    </>
                                                    :
                                                    <div className="sender-chat-content">
                                                        <div style={{
                                                            background: 'blue',
                                                            padding: '5px',
                                                            borderTopRightRadius: '5px',
                                                            borderTopLeftRadius: '5px',
                                                            borderBottomRightRadius: '5px',
                                                            borderBottomLeftRadius: '0'
                                                        }}>{item.mssg}</div>
                                                        <div style={{
                                                            fontSize: 'x-small',
                                                            float: 'left',
                                                            color: '#000',
                                                            marginLeft: '3px'
                                                            // background: 'green'
                                                        }}>{js_ago(new Date('2020-01-01'))}</div>
                                                    </div>
                                                }
                                                
                                            </>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>


                    <div className="aside-chat-panel" style={styles.asidePanel}>

                        <div style={{float: 'left', width: '82%'}}>
                            <textarea style={{
                                height: '60px',
                                width: '100%',
                                background: '#fff',
                                outline: 'none',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '10px', 
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: 'large',
                                resize: 'none'
                            }} type="text"></textarea>
                        </div>
                        <div style={{float: 'right', width: '15%'}}>
                            <button style={{
                                height: '35px',
                                width: '50px',
                                background: '#fff',
                                cursor: 'pointer',
                                outline: 'none',
                                border: 'none',
                                borderRadius: '4px',
                                position: 'absolute',
                                bottom: '8px',
                                right: '5px'
                            }} >
                                <b>send</b>
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}



let styles = {
    aside: {
        height: '90%',
        width: '350px',
        background: '#fff',
        position: 'fixed',
        bottom: '5px',
        right: '5px'
    },
    asidePanel: {
        height: '70px',
        width: '100%',  
        background: '#efefef',
        padding: '5px',
        position: 'relative'
    },
    ul: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-evenly'
    },

    li: {
        padding: '5px',
        outline: 'none',
        opacity: '1',
        border: 'none',
        zIndex: '1000',
        margin: '0 5px 0 5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        background: 'transparent'
    }
}