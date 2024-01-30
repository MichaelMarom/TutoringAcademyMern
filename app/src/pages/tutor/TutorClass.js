import { useEffect, useRef, useState } from "react";
import TutorCollabBoard from "../../components/tutor/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";
import Countdown from "react-countdown";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

// import { Tldraw } from '@tldraw/tldraw'
// import { Excalidraw } from "@excalidraw/excalidraw";
import {
  Excalidraw,
} from "@excalidraw/excalidraw";
import '../../styles/tutor.css'

const TutorClass = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <div style={{ position: 'fixed', inset: 0, marginTop: "100px" }}>
        <div>
          <Countdown date={Date.now() + 1000 * 60}>
            <div>Session Ended!</div>
          </Countdown>
          {/* <CountdownCircleTimer
            isPlaying
            duration={60 * 50}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60 * 50, 30, 15, 0]}
            size="50"
            strokeWidth={"6"}

          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer> */}
        </div>
        <Excalidraw />
      </div>
    </TutorLayout >
  );
};
// <TutorCollabFooter />

export default TutorClass;
