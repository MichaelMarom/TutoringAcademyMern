import { useEffect, useRef, useState } from "react";
import TutorCollabBoard from "../../components/tutor/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";
import Countdown from "react-countdown";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import FlipCountdown from '@rumess/react-flip-countdown';
import { moment } from '../../config/moment';

// import { Tldraw } from '@tldraw/tldraw'
// import { Excalidraw } from "@excalidraw/excalidraw";
import {
  Excalidraw,
} from "@excalidraw/excalidraw";
import '../../styles/tutor.css'

const TutorClass = () => {
  return (
    <TutorLayout showLegacyFooter={false} >
      <div className="d-flex" style={{ gap: "2%" }}>
        <div style={{ position: 'fixed', inset: 0, marginTop: "100px", width: "77%" }}>

          <Excalidraw />
        </div>

        <div className="bg-light rounded" style={{ width: "28%" }
        }>
         
          <TutorCollabBoard />
        </div >
      </div >
    </TutorLayout >
  );
};
// <TutorCollabFooter />

export default TutorClass;
