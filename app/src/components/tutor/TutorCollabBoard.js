import TutorAside from "./TutorCollabAside";
import '../../styles/canvas.css'
import Actions from "../common/Actions";
const TutorCollabBoard = () => {

    return (
        <div className="TutorCollabBoard">
            <TutorAside />
            <canvas id="drawPlace" className="drawPlace" style={{ border: '1px solid #eee' }}>
            </canvas>
            <Actions
                editDisabled={true}
                saveDisabled={true}
            />
        </div>
    );
}

export default TutorCollabBoard;