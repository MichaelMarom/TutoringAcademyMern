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
import TutorAside from "../../components/tutor/Collab/TutorCollabAside";
import { BiChat } from "react-icons/bi";
import Switch from '../../components/common/Switch'
import { MdCancel } from "react-icons/md";
import Tooltip from "../../components/common/ToolTip";
import _ from "lodash";

const TutorClass = () => {
  const { user } = useSelector(state => state.user)
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const { student } = useSelector(state => state.student)
  const { tutor } = useSelector(state => state.tutor)
  const [elements, setElements] = useState([]);
  const [collaborators, setCollaborators] = useState(new Map());
  const [files, setFiles] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)


  useHandleLibrary({ excalidrawAPI });
  const params = useParams();
  const [isChecked, setIsChecked] = useState(false);


  const { upcomingSessionFromNow: tutorUpcomingFromNow,
    upcomingSession: tutorUpcoming,
    inMins: isTutorUpcomgLessonInMins, currentSession: tutorCurrentSession } = useSelector(state => state.tutorSessions)
  const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.studentSessions)

  // useEffect(() => {
  //   if (!excalidrawAPI) {
  //     return;
  //   }
  // }, [excalidrawAPI]);

  useEffect(() => {
    if (socket && excalidrawAPI) {
      params.sessionId && socket.emit('join-session', params.sessionId);
      socket.on('canvas-change-recieve', (change) => {
        // const collaborators = new Map();
        // collaborators.set("id6", {
        //   username: "Michael",
        //   isCurrentUser: true,
        //   isSpeaking: true,
        //   socketId: "123",
        //   avatarUrl: student.Photo,
        // });
        const mergedArray = _.uniqBy(excalidrawAPI.getSceneElements().concat(change.elements), 'id');
        console.log(mergedArray)
        setElements(mergedArray)
        setCollaborators(new Map([...collaborators, ...JSON.parse(change.collaborators)]))
        const allDetails = Object.values(change.files).map(entry => entry);

        setFiles(allDetails)
      });
      socket.on('active-tool-change', (change) => {
        // console.log(change)
      })
    }
  }, [params.sessionId, excalidrawAPI]);

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ elements, collaborators })
    }
  }, [elements, collaborators, excalidrawAPI])

  useEffect(() => {
    excalidrawAPI && excalidrawAPI.addFiles(files)
  }, [files])

  const handleExcalidrawChange = (newElements, appState, files) => {
    // console.log('ent', params, elements.length, user.role)
    // setElements([...elements, ...newElements])
    // params.sessionId && newElements.length && user.role === 'tutor' &&
    socket.emit('canvas-change', ({
      elements: _.uniqBy(excalidrawAPI.getSceneElements().concat(newElements), 'id'),
      sessionId: params.sessionId,
      // collaborator: { username: tutor.TutorScreenname, AcademyId: tutor.AcademyId },
      files
    }));

    // params.sessionId && newElements.length && user.role === 'student' &&
    // socket.emit('canvas-change', ({
    //   sessionId: params.sessionId,
    //   elements: _.uniqBy(excalidrawAPI.getSceneElements().concat(newElements), 'id'),
    //   // collaborator: { username: student.ScreenName, AcademyId: student.AcademyId },
    //   files
    // }));
  };

  const handlePointerDown = (activeTool,
    pointerDownState,
    event) => {
    // console.log(activeTool, pointerDownState, event)
  }

  const handlePointerUpEvent = (activeTool,
    pointerDownState,
    event) => {

    socket.emit('activeTool', ({
      sessionId: params.sessionId,
      activeTool
    }))
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
            isCollaborating={user.role === 'tutor'}
            onPointerDown={handlePointerDown}
            onPointerUpdate={handlePointerUpEvent}
            // viewModeEnabled={user.role !== 'tutor'}
            onChange={handleExcalidrawChange}
            name={currentSession.subject || 'testing'}
          />
        </div>

        {<div className="bg-light rounded shadow-lg"
          style={{ width: "20%", position: "fixed", right: 0 }}>
          {/* <div onClick={() => setIsChatOpen(false)} className="cursor-pointer"> <MdCancel size={24} /> </div> */}
          <TutorAside />
          <div className="d-flex align-items-center justify-content-center" >
            <Tooltip text={"swicth text goes here"} iconSize="25" />
            <Switch isChecked={isChecked} setIsChecked={setIsChecked} authorized={user.role === 'tutor'} />
          </div>
        </div>}
        {/* <div style={{ position: "fixed", bottom: "10%", right: "3%" }}>
          <div onClick={() => setIsChatOpen(!isChatOpen)}>
            <BiChat size={32} />
          </div>
        </div> */}
      </div>
    </CommonLayout>
  );
};

export default TutorClass;
