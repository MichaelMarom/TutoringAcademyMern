import { useEffect } from "react";
import StudentAside from "./StudentCollabAside";

const StudentCollabBoard = () => {

    return ( 
        <>
            <div className="StudentCollabBoard">


                <StudentAside />

                <canvas id="drawPlace" style={{border:'1px solid #eee'}}>
            
                </canvas> The Lesson will start in 3:00 minutes
            </div>
        </>
     );
}
 
export default StudentCollabBoard;