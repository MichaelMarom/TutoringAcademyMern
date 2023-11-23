import { useEffect, useState } from "react";
import home from '../../images/home-vector-svgrepo-com.svg';
import del from '../../images/delete-svgrepo-com.svg';
import { useLocation, useNavigate } from "react-router-dom";
import StudentCollabTools from "./StudentCollabTools";
import { useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";



function MyTimer({ expiryTimestamp }) {
    const {
      totalSeconds,
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({ expiryTimestamp, onExpire: () => {
        alert('This lesson was ended. You are directed now to the feedback screen.This lesson is marked by green blinking frame. Please rate this lesson.');
window.location.href = '/student/feedback'
    } });
  
    return (
      <div style={{textAlign: 'right'}}>
        {/* <h1>react-timer-hook </h1>
        <p>Timer Demo</p> */}
        <div style={{fontSize: 'large', color: '#fff'}}>
          {/* <span>{days}</span>:<span>{hours}</span>: */}
          <span className="minute-timer">{minutes} Mins</span>:<span>&nbsp;{seconds} Sec</span>
        </div>
        {/* <p>{isRunning ? 'Running' : 'Not running'}</p>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        <button onClick={() => {
          // Restarts to 5 minutes timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + 300);
          restart(time)
        }}>Restart</button> */}
      </div>
    );
  }

const StudentCollabHeader = () => {

    let location = useLocation();
    let navigate = useNavigate();

    let [hr,setHr] = useState(0)
    let [min,setMin] = useState(0)
    let [sec,setSec] = useState(0)
    let [msec,setMsec] = useState(0)
    
    
    
     
 

    let handleAsidePanel = e => {
        let studentAsideElem = document.querySelector('.StudentAside');
        if(studentAsideElem.hasAttribute('id')){
            studentAsideElem?.removeAttribute('id')
        }else{
            studentAsideElem?.setAttribute('id', 'StudentAside')

        }
    }
    
    

    return ( 
        <>
            <div className="StudentCollabHeader">
                <div className="left">

                    <button>
                        <img src={home}  style={{height: '25px', width: '25px'}} alt="..." />
                    </button>

                    <button>
                        <img src={del}  style={{height: '25px', width: '25px'}} alt="..." />
                    </button>

                    
                    
                </div>

                <div>

                    <StudentCollabTools />
                    
                </div>
                <div className="right">
                    <div>
                    {/* <span className="digit" id="hr">
                            {hr}</span>
                        <span className="txt">Hr</span>
                        &nbsp;&nbsp;
                        <span className="digit" id="min">
                            {min}</span>
                        <span className="txt">Min</span> */}
                        {/*&nbsp;&nbsp;
                        <span className="digit" id="sec">
                            {sec}</span>
                        <span className="txt">Sec</span>
                        &nbsp;&nbsp;
                        <span className="digit" id="count">
    {msec}</span>*/}
                    </div>

                    <button onClick={handleAsidePanel}>
                        Hide Conference Panel 
                    </button>
                </div>
            </div>
        </>
     );
}
 
export default StudentCollabHeader;