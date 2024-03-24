import TutorCollabBoard from "../../components/tutor/Collab/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/Collab/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/Collab/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";

import {
  Excalidraw,
  LiveCollaborationTrigger,
  useHandleLibrary
} from "@excalidraw/excalidraw";
import { socket } from '../../config/socket'
import '../../styles/tutor.css'
import CommonLayout from "../../layouts/CommonLayout";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { constants } from "buffer";
import { useParams } from "react-router-dom";
import { RiContactsBookLine } from "react-icons/ri";

const TutorClass = () => {
  const { user } = useSelector(state => state.user)
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const { student } = useSelector(state => state.student)
  const { tutor } = useSelector(state => state.tutor)
  const [elements, setElements] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  useHandleLibrary({ excalidrawAPI });
  const params = useParams();

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    // Fetch image and add it to Excalidraw
  }, [excalidrawAPI]);

  useEffect(() => {
    if (socket) {
      params.sessionId && socket.emit('join-session', params.sessionId);
      socket.on('canvas-change-recieve', (change) => {
        console.log(change)
        // const collaborators = new Map();
        // collaborators.set("id6", {
        //   username: "Michael",
        //   isCurrentUser: true,
        //   isSpeaking: true,
        //   socketId: "123",
        //   avatarUrl: student.Photo,
        // });
        setElements([...elements, ...change.elements])
        // setCollaborators([...collaborators, new Map(JSON.parse(change.collaborators))])
        // excalidrawAPI.updateScene({ elements: change.elements, collaborators: new Map(JSON.parse(change.collaborators)) });
      });
    }
  }, [params.sessionId]);

  useEffect(() => {
    if (socket && excalidrawAPI) {
      console.log(elements, collaborators, excalidrawAPI)
      excalidrawAPI.updateScene({ elements })
    }
  }, [elements, collaborators, excalidrawAPI])

  const { upcomingSessionFromNow: tutorUpcomingFromNow,
    upcomingSession: tutorUpcoming,
    inMins: isTutorUpcomgLessonInMins, currentSession: tutorCurrentSession } = useSelector(state => state.tutorSessions)
  const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.studentSessions)

  const handleExcalidrawChange = (newElements, appState, files) => {
    // console.log('ent', elements, appState, files)
    // console.log('ent', params, elements.length, user.role)
    // setElements([...elements, ...newElements])
    params.sessionId && newElements.length && user.role === 'tutor' &&
      socket.emit('canvas-change', ({
        newElements,
        sessionId: params.sessionId,
        // collaborator: { userName: tutor.TutorScreenname, avatarUrl: tutor.Photo }
      }));

    // params.sessionId && newElements.length && user.role === 'student' &&
    //   socket.emit('canvas-change', ({
    //     sessionId: params.sessionId,
    //     // newElements,
    //     // collaborator: { userName: student.ScreenName, avatarUrl: student.Photo }
    //   }));
  };

  const handlePointerDown = (activeTool,
    pointerDownState,
    event) => {
    // console.log(activeTool, pointerDownState, event)
  }

  const handlePointerUpEvent = (activeTool,
    pointerDownState,
    event) => {
    // console.log(activeTool, pointerDownState, event)
  }

  return (
    <CommonLayout role={user.role}>
      {currentSession.subject ? <div style={{ width: "70%" }} className={`d-flex ${currentSession.subject ? "justify-content-between" : "justify-content-center"}`} >
        <div >Current Session: {currentSession.subject}</div>
        <h4 className="text-center text-success blinking-button m-0">Lesson will start in 3 minutes</h4>
      </div> :
        <h4 className="text-center text-success m-0"> No Current Session!</h4>
      }
      <div className="d-flex" style={{ gap: "2%" }}>
        <div style={{ position: 'fixed', inset: 0, top: 0, marginTop: "100px", width: "80%" }}>
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            isCollaborating={true}
            onPointerDown={handlePointerDown}
            onPointerUpdate={handlePointerUpEvent}
            // viewModeEnabled={true}   // Assuming you want to enable view mode
            // zenModeEnabled={true}    // Assuming you want to enable Zen mode
            onChange={handleExcalidrawChange}
            name={currentSession.subject || 'testing'}
          />
        </div>

        <div className="bg-light rounded" style={{ width: "28%" }}>
          <TutorCollabBoard />
        </div>
      </div >
    </CommonLayout>
  );
};

export default TutorClass;
