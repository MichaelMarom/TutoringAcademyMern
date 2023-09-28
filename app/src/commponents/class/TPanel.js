import { useEffect, useState } from 'react';


import pinImage from '../../images/attachment-svgrepo-com.svg';
import micImage from '../../images/microphoneoutline-svgrepo-com.svg';
import mssgImage from '../../images/send-1-svgrepo-com.svg';
import { socket } from '../../socket';
import { useLocation } from 'react-router-dom';



const TPanel = () => {
    let [sendType, setSendType] = useState(micImage);

    let [handler, setHandler] = useState('record');
    let [chat, setChat] = useState('');
    let [role, setRole] = useState(null);

    let location = useLocation();

    useEffect(() => {
        if(location.pathname.split('/').splice(-2)[0] === '0'){
            setRole(0);
        }else{
            setRole(1);
        }
    }, [location])

    let handleMssgInput = e => {

        if(!e.target.value.length > 0){
            setSendType(micImage);
            setHandler('record')
        }else{
            setSendType(mssgImage);
            setHandler('message');
            setChat(e.target.value)
        }
        
    }

    

    let handleMessenger = e => {
        let b = document.querySelector('.mssg-bx')


        let item = 
        `
        <div id='x-position-positive' style='height: fit-content; width: 100%; position: relative; display: flex;'>
            <p class='mychat' >${chat}</p>
        </div>
        `

        socket.emit('chat', {
            room: location.pathname.split('/').splice(-1),
            mssg: chat,
            role: role
        })

        b.insertAdjacentHTML('beforeend', item)
        setSendType(micImage);
        setHandler('record')

        setChat('');
        document.querySelector('textarea').value = '';


    }


    return ( 
        <>
        
            <div className="mssg-panel shadow-sm">
                

                <textarea style={{float: 'left', height: '50px', outline: 'none', padding: '10px 10px 5px 20px', border: 'none', fontSize: '2.5vh', resize: 'none', width: '350px'}} onInput={handleMssgInput} placeholder='Type Message Here' name="" id="" ></textarea>

                <div className="mic" data-handler={handler} onClick={e => e.currentTarget.dataset.handler === 'message' ? handleMessenger(e) : console.log('recording')}>
                    <img src={mssgImage} style={{height: '60%', rotate: '-45deg', width: '60%'}} alt="..." />
                </div>
            </div>

        </>
     );
}
 
export default TPanel;