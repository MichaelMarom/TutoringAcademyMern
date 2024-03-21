import React from 'react'
import TutorLayout from '../layouts/TutorLayout';
import StudentLayout from '../layouts/StudentLayout';
// import StudentCollabBoard from '../components/student/Collab/StudentCollabBoard';
// import Actions from '../components/common/Actions';
import { Excalidraw } from '@excalidraw/excalidraw';
import TutorCollabBoard from '../components/tutor/Collab/TutorCollabBoard';

export default function Collaboration({role}) {


  return (
    <>

        {
            role == 'tutor'
            ?
            <>
                <TutorLayout>
                    <TutorClass />
                </TutorLayout>
            </>
            :
            role === 'student'
            ?
            <>
                <StudentLayout>
                <TutorClass />
                </StudentLayout>
            </>
            :
            ''
        }

    </>
  )
}


const StudentClass = () => {
    return (
        <div>
            <h4 className="text-center text-primary blinking-button m-0">Lesson will start in 3 minutes</h4>
            <div className="d-flex" style={{ gap: "2%" }}>
                <div style={{ position: 'fixed', inset: 0, top:0,marginTop: "75px", width: "80%" }}>
                    <Excalidraw />
                </div>

                <div className="bg-light rounded" style={{ width: "28%" }}>
                    {/* <StudentCollabBoard /> */}
                </div>
            </div >
            {/* <Actions saveDisabled /> */}
        </div>
    );
}


const TutorClass = () => {
  
    return (
      <div>
        <h4 className="text-center text-success blinking-button m-0">Lesson will start in 3 minutes</h4>
        <div className="d-flex" style={{ gap: "2%" }}>
          <div style={{ position: 'fixed', inset: 0, top: 0, marginTop: "50px", width: "80%" }}>
            <Excalidraw />
          </div>
  
          <div className="bg-light rounded" style={{ width: "28%" }}>
  
            <TutorCollabBoard />
          </div >
        </div >
      </div>
    );
  };