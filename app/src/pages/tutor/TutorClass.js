import TutorCollabBoard from "../../components/tutor/Collab/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/Collab/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/Collab/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'


import {
  Excalidraw,
} from "@excalidraw/excalidraw";
import '../../styles/tutor.css'

const TutorClass = () => {
  return (
    <TutorLayout showLegacyFooter={false} >
      <h4 className="text-center text-primary blinking-button m-0">Lesson will start in 3 minutes</h4>
      <div className="d-flex" style={{ gap: "2%" }}>
        <div style={{ position: 'fixed', inset: 0, top:0,marginTop: "75px", width: "80%" }}>
          <Excalidraw />
        </div>

        <div className="bg-light rounded" style={{ width: "28%" }}>
        
          <TutorCollabBoard />
        </div >
      </div >
    </TutorLayout >
  );
};
// <TutorCollabFooter />

export default TutorClass;
