import { useEffect, useState } from 'react';
import screenLarge from '../../images/screen-full-svgrepo-com.svg';
import screenNormal from '../../images/screen-normal-svgrepo-com.svg'
import DiableVideoImage from '../../images/video-recorder-off-svgrepo-com.svg'; 
import { useLocation } from 'react-router-dom';
import {Peer} from 'peerjs';
import {v4} from 'uuid';
import { socket } from '../../socket';
import Pusher from 'pusher-js';

const TVid = () => {
    let location = useLocation(); 
    let [authorization, setAuthorization] = useState(false);
    let [peerId, setPeerId] = useState('')
    let [conn, setConn] = useState('');
    let [videoLoader, setVideoLoader] = useState('');
    let [largeScreen, setLargeSreccn] = useState(false);
    let [screenType, setScreenType] = useState(screenLarge);
    let [isVisuals, setIsVisuals] = useState('')

    let [visuals, setVisuals ]= useState(true)
    let [uname, setUname] = useState('')

    

let handleVisuals = ()  => {
    if(visuals){
        setVisuals(false)
    }else{
        setVisuals (true)
    }
}

    let handleVidActions = e => {
        console.log(e.currentTarget)
        if(e.currentTarget.className === 'video-size'){
            if(!largeScreen){
                setLargeSreccn(true)
                setScreenType(screenNormal)
                
                let tabElem = document.querySelector('.tutor-video-options');
                tabElem.style.position = 'fixed';
                tabElem.style.top = '60px';
                tabElem.style.right = '10px';
                tabElem.style.zIndex = '36';

                let vidElem = document.querySelector('.video-tab');
                vidElem.style.width = '100vw';
                vidElem.style.height = '100vh';
                vidElem.style.position = 'fixed';
                vidElem.style.zIndex = '35';
                vidElem.style.left = '0';
            }else{
                setLargeSreccn(false)
                setScreenType(screenLarge)
                let tabElem = document.querySelector('.tutor-video-options');
                tabElem.removeAttribute('style')

                let vidElem = document.querySelector('.video-tab');
                vidElem.removeAttribute('style')
            }
        }else{

        }
    }

    
    useEffect(() => {

        //let myVideo = document.querySelector('.video-tab');
        //myVideo.style.background = '#fff'

        //let c = document.querySelector('canvas');

        //let s = c.captureStream();

        // myVideo.srcObject = s

        
    }, [])
    
      
    

    
    
    useEffect(() => {
 

        let myVideo = document.querySelector('.video-tab');
        let room_id = location.pathname.split('/').splice(-1)[0];
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

            // let canvas = document.querySelector('canvas');
            // let canvasStream = canvas.captureStream();

            addVideoStream(myVideo, stream);

            if(location.pathname.split('/').splice(-2)[0] === '1'){
                peer.on('call', call => {
                    setVideoLoader('Connecting...')
                    call.answer(stream)
                    call.on('stream', userVideoStream => {
                        setVideoLoader('')
                        addVideoStream(myVideo, userVideoStream)
                    })
                })
            }else{
                peer.on('call', call => {
                    setVideoLoader('Connecting...')
                    call.answer(stream)
                    call.on('stream', userVideoStream => {
                        setVideoLoader('')
                        addVideoStream(myVideo, userVideoStream)
                    })
                })
            }

            

            
            socket.on('user-connected', user_id => {
                if(location.pathname.split('/').splice(-2)[0] === '1'){
                    connectToNewUser(user_id, stream)

                    peer.on('call', call => {
                        setVideoLoader('Connecting...')
                        call.answer(stream)
                        call.on('stream', userVideoStream => {
                            setVideoLoader('')
                            addVideoStream(myVideo, userVideoStream)
                        })
                    })
                }else{ 
                    connectToNewUser(user_id, stream)

                    peer.on('call', call => {
                        setVideoLoader('Connecting...')
                        call.answer(stream)
                        call.on('stream', userVideoStream => {
                            setVideoLoader('')
                            addVideoStream(myVideo, userVideoStream)
                        })
                    })
                    
                }
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
                setVideoLoader('')
                addVideoStream(myVideo, userVideoStream)
            })

            call.on('close', () => {
              myVideo.remove()
            })
          
            peers[userId] = call
        }
          
        function addVideoStream(video, stream) {
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => {
              video.play()
            })
        }

        
    }, [location, peerId])


    return ( 
        <>
            <video className='video-tab' id='video' autoPlay>
                
            </video>
            
            

            <div className="tutor-video-options">
                
                <div className="video-size" onClick={handleVidActions} style={{background: '#fff', opacity: '.4'}}>
                    <img src={screenType} style={{height: '50%', width: '50%'}} alt="..." />

                </div>
                <div className="disable-visuals" onClick={handleVisuals}>
                    <img src={DiableVideoImage} style={{height: '50%', width: '50%'}} alt="..." />

                </div>
                <div className="video-chat-loader">
                    {videoLoader}
                </div>
            </div>

            
        </>
     );
}
 
export default TVid;

/*


                    

                    

                    <div className="info-panel shadow-sm"></div>

                    
                    

*/