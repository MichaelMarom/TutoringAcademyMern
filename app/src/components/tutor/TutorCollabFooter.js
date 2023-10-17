import { useEffect, useState } from "react";
import { socket } from "../../socket";

const TutorCollabFooter = () => {

    let [accessState, setAccessState] = useState('Emeka is restricted')


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
                <div className="TutorBoardAccessIndicator">
                    <div className="TutorBoardAccessMessage" style={{width: '60%'}}>
                        {
                            accessState
                        }
                    </div>

                    <div className="TutorBoardAccessActions" style={{width: '40%', display: 'flex', padding: '5px 15px 5px 5px'}}>
                        <button onClick={socket.emit('tutorBoardAccessResponse', true)} style={{color: 'green', margin: '0 5px 0 5px', borderRadius: '10px', padding: '10px', width: '50%', height: '100%'}}>
                            Allow
                        </button>

                        <button onClick={socket.emit('tutorBoardAccessResponse', false)} style={{color: 'red', margin: '0 5px 0 5px', borderRadius: '10px', padding: '10px', width: '50%', height: '100%'}}>
                            Reject
                        </button>
                    </div>
                </div>
            </div>
        </>
     );
}
 
export default TutorCollabFooter;