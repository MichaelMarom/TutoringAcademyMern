import headsetImage from  '../../images/headphones-audio-svgrepo-com.svg';
import videoImage from  '../../images/video-player-movie-svgrepo-com.svg';
import photoImage from  '../../images/picture-photo-svgrepo-com.svg';
import documentImage from '../../images/documents-document-svgrepo-com.svg';
import { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { useLocation } from 'react-router-dom';


const TMssg = () => {
    let [role, setRole] = useState(null);
    let [mssgs, setMssgs] = useState(null);
    const jsmediatags = window.jsmediatags;
    let location = useLocation();
    
    useEffect(() => {

        new Promise((resolve, reject) => {
            if(location.pathname.split('/').splice(-2)[0] === '0'){
                setRole(0);
                resolve()
            }else{
                setRole(1);
                resolve()
            }
        })
        .then(() => {
            socket.emit('getChat', {id: location.pathname.split('/').splice(-1)[0]});
        })
        

        socket.on('getChat', data => {
            let mssgs = data.map(item => { 

                if(item.role === role){
                    return(
                        <div style={{height: 'fit-content', width: '100%', position: 'relative', display: 'flex'}} id='x-position-positive'>
            
                            <p className='mychat'  key={item.id}>
                                {item.message}
                            </p>
                
                        </div>
                    )
                }else{
                    return(
                        <div style={{height: 'fit-content', width: '100%', position: 'relative', display: 'flex'}} id='x-position-negative'>
            
                            <p className='chatmate'  key={item.id}>
                                {item.message}
                            </p>
                
                        </div>
                    )
                }
                
            });

            setMssgs(mssgs)


        })

        socket.on('chat', data => {
            let mssg = <div style={{height: 'fit-content', width: '100%', position: 'relative', display: 'flex'}} id='x-position-negative'>
            
                <p className='chatmate'  >
                    {data}
                </p>
    
            </div>

            setMssgs(...mssgs, mssg)


            
        })

    }, [location, role,mssgs])


    /*let mssgs = c.chats.map(item => 
        <div style={{height: 'fit-content', width: '100%', position: 'relative', display: 'flex'}} id={item.side}>

            <p className={item.src}  key={item.id}>
                {item.Mssg}
            </p>

        </div>
    )   */


    return ( 
        <>
            <div className="mssg-bx ">

                {
                    mssgs
                }
                
            </div>

        </>
     );
}
 
export default TMssg;