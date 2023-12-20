import { useEffect, useState } from "react";
import { socket } from "../../config/socket";

const TutorCollabFooter = () => {

    let [accessState, setAccessState] = useState('Shift whiteboard to Student Emeka. ')


    useEffect(() => {
        socket.on('studentBoardAccessRequest', (name) => {
            setAccessState(`${name} requested access to the board`)
            let txt = `${name} requested access to the board`;
            let confirm = window.confirm(txt);
            if(confirm){
                socket.emit('tutorBoardAccessResponse', true) 
    
            } else{
                socket.emit('tutorBoardAccessResponse', false)
    
            }
        })
    }, [])
    



    
    return ( 
        <>
            <div className="TutorCollabFooter">

                <div className="TutorBoardAccessBoard" style={{width: '60%', height: '100%', float: 'left ', display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'left', overflow: 'auto', padding: '10px'}}>
                    <div style={{flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', padding: '10px'}}>Board 1</div>
                </div>
                <div className="TutorBoardAccessIndicator"style={{float: 'right'}}>
                    <div className="TutorBoardAccessMessage" style={{width: '60%'}}>
                        {
                            accessState
                        }
                    </div>

                    <div className="TutorBoardAccessActions" style={{width: '40%', display: 'flex', padding: '5px 15px 5px 5px'}}>
                        <button onClick={e => socket.emit('tutorBoardAccessResponse', true)} style={{color: 'green', margin: '0 5px 0 5px', borderRadius: '10px', padding: '10px', width: '50%', height: '100%'}}>
                            Allow
                        </button>

                        <button onClick={e => socket.emit('tutorBoardAccessResponse', false)} style={{color: 'red', margin: '0 5px 0 5px', borderRadius: '10px', padding: '10px', width: '50%', height: '100%'}}>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default TutorCollabFooter;