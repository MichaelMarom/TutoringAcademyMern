import TutorCollabFooter from "../../components/tutor/Collab/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/Collab/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";

import {
  Excalidraw,
  LiveCollaborationTrigger,
  WelcomeScreen,
  useHandleLibrary
} from "@excalidraw/excalidraw";
import { socket } from '../../config/socket'
import '../../styles/tutor.css'
import CommonLayout from "../../layouts/CommonLayout";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { constants } from "buffer";
import { useLocation, useParams } from "react-router-dom";
import { RiContactsBookLine } from "react-icons/ri";
import TutorAside from "../../components/tutor/Collab/TutorCollabAside";
import { BiChat } from "react-icons/bi";
import Switch from '../../components/common/Switch'
import { MdCancel } from "react-icons/md";
import Tooltip from "../../components/common/ToolTip";
import _ from "lodash";
import { toast } from "react-toastify";
import { getSessionDetail } from "../../axios/tutor";

const TutorClass = () => {
  const { user } = useSelector(state => state.user)
  const { student } = useSelector(state => state.student)
  const { tutor } = useSelector(state => state.tutor)

  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [elements, setElements] = useState([]);
  const [collaborators, setCollaborators] = useState(new Map());
  const [files, setFiles] = useState([])

  const [isChatOpen, setIsChatOpen] = useState(false)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId')
  const [openedSession, setOpenedSession] = useState({})
  const [sessionTime, setSessionTime] = useState('')

  useEffect(() => {
    sessionId && (student.timeZone || tutor.timeZone) &&
      getSessionDetail(sessionId, user.role === 'student' ? student.timeZone : tutor.timeZone)
        .then(res => {
          setOpenedSession(res.session)
          setSessionTime(res.time)
        })
  }, [sessionId, student, tutor, user])

  useHandleLibrary({ excalidrawAPI });
  const params = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [hasAuth, setAuth] = useState(false)

  useEffect(() => { setAuth(user.role === 'tutor') }, [user])

  const { upcomingSessionFromNow: tutorUpcomingFromNow,
    upcomingSession: tutorUpcoming,
    inMins: isTutorUpcomgLessonInMins, currentSession: tutorCurrentSession } = useSelector(state => state.tutorSessions)
  const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.studentSessions)

  // useEffect(() => {
  //   if (!excalidrawAPI) {
  //     return;
  //   }
  // }, [excalidrawAPI]);

  function getUniqueIdsWithHigherVersion(arr) {
    const groupedById = _.groupBy(arr, 'id');
    const uniqueIdsWithHigherVersion = _.map(groupedById, group => _.maxBy(group, 'version'));
    return uniqueIdsWithHigherVersion;
  }

  useEffect(() => {
    if (socket && excalidrawAPI && sessionTime === 'current') {
      sessionId && socket.emit('join-session', sessionId);
      socket.on('canvas-change-recieve', (change) => {
        // const collaborators = new Map();
        // collaborators.set("id6", {
        //   username: "Michael",
        //   isCurrentUser: true,
        //   isSpeaking: true,
        //   socketId: "123",
        //   avatarUrl: student.Photo,
        // });
        const mergedArray = getUniqueIdsWithHigherVersion(excalidrawAPI.getSceneElements().concat(change.elements), 'id');
        // console.log(mergedArray)
        setElements(mergedArray)
        setCollaborators(new Map([...collaborators, ...JSON.parse(change.collaborators)]))
        const allDetails = Object.values(change.files).map(entry => entry);

        setFiles(allDetails)
      });
      socket.on('active-tool-change', (change) => {
        // console.log(change)
      })
      socket.on('recieve-authorization', (data) => {
        if (user.role !== 'tutor') {
          (data.hasAuthorization) ?
            toast.success('Tutor has given you access to access the canvas tools.') :
            toast.warning('Tutor has removed your access to the canvas tools!');

          setAuth(data.hasAuthorization)
          setIsChecked(data.hasAuthorization)
        }
      })
    }
  }, [sessionId, excalidrawAPI, sessionTime]);

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ elements })
    }
  }, [elements, collaborators, excalidrawAPI])

  useEffect(() => {
    (excalidrawAPI && !_.isEqual(_.sortBy(files.map(file => file.id)),
      _.sortBy(Object.keys(excalidrawAPI.getFiles())))) && excalidrawAPI.addFiles(files)
  }, [files, excalidrawAPI])

  const handleExcalidrawChange = (newElements, appState, files) => {
    // console.log('ent', params, elements.length, user.role)
    // setElements([...elements, ...newElements])
    sessionId && newElements.length && sessionTime === 'current' &&
      socket.emit('canvas-change', ({
        elements: getUniqueIdsWithHigherVersion(excalidrawAPI.getSceneElements().concat(newElements), 'id'),
        sessionId: sessionId,
        // collaborator: { username: tutor.TutorScreenname, AcademyId: tutor.AcademyId },
        files
      }));

    // sessionId && newElements.length && user.role === 'student' &&
    // socket.emit('canvas-change', ({
    //   sessionId: sessionId,
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
    sessionTime === 'current' &&
      socket.emit('activeTool', ({
        sessionId: sessionId,
        activeTool
      }))
  }

  useEffect(() => {
    if (socket && sessionId && sessionTime === 'current') {
      socket.emit('authorize-student', ({
        userId: student?.AcademyId,
        sessionId: sessionId,
        hasAuthorization: isChecked
      }))
    }
  }, [isChecked, sessionId, sessionTime])

  useEffect(() => {
    excalidrawAPI &&
      sessionId &&
      elements.length &&
      sessionTime === 'current' &&
      localStorage.setItem(sessionId, JSON.stringify(elements))
  }, [elements, sessionId, excalidrawAPI, sessionTime])

  useEffect(() => {
    if (excalidrawAPI && sessionId && sessionTime === 'current') {
      const elements = localStorage.getItem(sessionId)
      const parsedElems = JSON.parse(elements)
      excalidrawAPI.updateScene({ elements: parsedElems })
    }
  }, [excalidrawAPI, sessionId, sessionTime])

  return (
    <CommonLayout role={user.role}>
      {openedSession.subject ? <div style={{ width: "70%" }}
        className={`d-flex ${openedSession.subject ? "justify-content-between" : "justify-content-center"}`} >
        <div> Subject: {openedSession.subject}
          {sessionTime === 'future' && <p className="text-danger">Session is in Future</p>}
          {sessionTime === 'past' && <p className="text-danger">Session already Pass</p>}
        </div>
        <h4 className="text-center text-success blinking-button m-0">Lesson will start in 3 minutes</h4>
      </div> :
        <h4 className="text-center text-success m-0">No Current Session!</h4>
      }

      <div className="d-flex" style={{ gap: "2%" }}>
        <div style={{
          position: 'fixed', inset: 0, top: 0, marginTop: "100px",
          width: "80%", border: "2px solid lightgray"
        }}
          className="rounded"
        >
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            isCollaborating={user.role === 'tutor'}
            onPointerDown={handlePointerDown}
            onPointerUpdate={handlePointerUpEvent}
            viewModeEnabled={!hasAuth}
            onChange={handleExcalidrawChange}
            name={openedSession.subject || 'testing'}
          >
            <WelcomeScreen>
              <WelcomeScreen.Center>
                <WelcomeScreen.Center.Logo />
                <WelcomeScreen.Center.Heading>
                 Lesson Will start in 3 minutes
                </WelcomeScreen.Center.Heading>
                <WelcomeScreen.Center.Menu>
                  {/* <WelcomeScreen.Center.MenuItemLink href="https://github.com/excalidraw/excalidraw">
                    Excalidraw GitHub
                  </WelcomeScreen.Center.MenuItemLink>
                  <WelcomeScreen.Center.MenuItemHelp /> */}
                </WelcomeScreen.Center.Menu>
              </WelcomeScreen.Center>
            </WelcomeScreen>
          </Excalidraw>
        </div>

        {<div className="bg-light rounded shadow-lg"
          style={{ width: "20%", position: "fixed", right: 0 }}>
          {/* <div onClick={() => setIsChatOpen(false)} className="cursor-pointer">
           <MdCancel size={24} /> </div> */}
          <TutorAside openedSession={openedSession} sessionTime={sessionTime} />
          {sessionTime === 'current' && <div className="d-flex align-items-center justify-content-center" >
            <Tooltip text={"switch text goes here"} iconSize="25" />
            <Switch
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              authorized={user.role === 'tutor' && sessionTime === 'current'} />
          </div>}
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
