import { useEffect, useState } from "react";
import { socket } from "../../config/socket";
import { useDispatch } from "react-redux";
import { setToolReqTo } from "../../redux/student_store/toolReq";

const StudentCollabFooter = () => {
    let dispatch = useDispatch()

    let [accessState, setAccessState] = useState('Access board here!');
    let [student_board_query, set_student_board_query] = useState('Access board here!');

  

    useEffect(() => {
        
        socket.on('tutorBoardAccessResponse', (boolean) => {

            if(boolean){
                document.querySelector('#StudentBoardAccessBtn').disabled = false
                setAccessState("Access Granted");
                dispatch(setToolReqTo(true))
    
            }else{
                document.querySelector('#StudentBoardAccessBtn').disabled = false
                setAccessState("Access Restricted")
                dispatch(setToolReqTo(false))
    
            }
        })
    }, [])

    
    

  
    

    

    return ( 
        <>
            <div className="StudentCollabFooter">
                <div className="StudentBoardAccessIndicator">
                    <button id="StudentBoardAccessBtn" onClick={e => {
                         e.target.disabled = true;
                         socket.emit('studentBoardAccessRequest', 'Emeka');
                         setAccessState("Waiting For Tutors Response...")
                    }}>
                        {
                            accessState
                        }
                    </button>
                </div>
            </div>
        </>
     );
}
 
export default StudentCollabFooter;