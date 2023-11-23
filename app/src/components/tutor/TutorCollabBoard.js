import { useState } from "react";
import TutorAside from "./TutorCollabAside";
import '../../styles/canvas.css'
const TutorCollabBoard = () => {
    let [shapesCnt, setShapesCnt] = useState('')
    let [penStyle, setPenStyle] = useState('')
    let [thickness, setthickness] = useState('');

    

    
    return ( 
        <>
            <div className="TutorCollabBoard">


                <TutorAside />

                

                <canvas id="drawPlace" className="drawPlace" style={{border:'1px solid #eee'}}>
            
                </canvas>
            </div>
        </>
     );
}
 
export default TutorCollabBoard;