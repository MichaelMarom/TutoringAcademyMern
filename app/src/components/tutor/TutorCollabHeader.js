import { useEffect, useState } from "react";
import home from '../../images/home-vector-svgrepo-com.svg';
import del from '../../images/delete-svgrepo-com.svg';
import { useLocation, useNavigate } from "react-router-dom";
import TutorCollabTools from "./TutorCollabTools";
import Countdown from 'react-countdown';
import { useTimer } from 'react-timer-hook';



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

  
const TutorCollabHeader = () => {

    let [min,setMin] = useState(0);



    

    let [PanelChangeMssg, setPanelChangeMssg] = useState(['Show Video', 'Hide Video'])
    let [PanelChangeBool, setPanelChangeBool] = useState(true)

    // let location = useLocation();
    // let navigate = useNavigate();

    // let [hr,setHr] = useState(0)
    // let [sec,setSec] = useState(0)
    // let [msec,setMsec] = useState(0)
    // let [min,setMin] = useState(minutes)

    // let timer = false;

    // let hour = 0;
    // let minute = 50;
    // let second = 0;
    // let count = 0;

    // useEffect(() => {
    //     timer = true;
    //     stopWatch();
    // }, [])
     
    /*useEffect(() => {
        timer = false;
    }, [])
     
     
    resetBtn.addEventListener('click', function () {
        timer = false;
        hour = 0;
        minute = 0;
        second = 0;
        count = 0;
        document.getElementById('hr').innerHTML = "00";
        document.getElementById('min').innerHTML = "00";
        document.getElementById('sec').innerHTML = "00";
        document.getElementById('count').innerHTML = "00";
    });*/
     

    useEffect(() => {
       

    }, [])

    // function stopWatch() {
    //     if (timer) {
    //         count++;
     
    //         if (count == 60) {
    //             second--;
    //             count = 0;
    //         }
     
    //         if (second == 0) {
    //             minute--;
    //             second = 60;
    //             window.localStorage.setItem('collabMinuteHand', minute)
    //         }

    //         if(minute == 5){
    //             alert("This lesson is to be finished in 5 minutes.")
    //         }
     
    //         // if (minute == 60) {
    //         //     hour++;
    //         //     minute = 0;
    //         //     second = 0;
    //         //     window.localStorage.setItem('collabHourHand', hour)

    //         // }
     
    //         let hrString = window.localStorage.getItem('collabHourHand');
    //         let minString = window.localStorage.getItem('collabMinuteHand');
    //         let secString = second;
    //         let countString = count;
     
    //         // if (hour < 10) {
    //         //     hrString = "0" + hrString;
    //         // }
     
    //         if (minute < 10) {
    //             minString = "0" + minString;
    //         }
     
    //         if (second < 10) {
    //             secString = "0" + secString;
    //         }
     
    //         if (count < 10) {
    //             countString = "0" + countString;
    //         }
     
    //         setHr(hrString);
    //         setMin(minString);
    //         setSec(secString);
    //         setMsec(countString);


    //         setTimeout(stopWatch, 1000);
    //     }
    // }

    let handleAsidePanel = e => {
        setPanelChangeBool(!PanelChangeBool)
        let tutorAsideElem = document.querySelector('.TutorAside');
        if(tutorAsideElem.hasAttribute('id')){
            tutorAsideElem?.removeAttribute('id')
        }else{
            tutorAsideElem?.setAttribute('id', 'TutorAside')

        }
    }
    const time = new Date();
    time.setSeconds(time.getSeconds() + 3000); 


    
    return ( 
        <>
            <div className="TutorCollabHeader" style={{marginTop: '5px'}}>
                <div className="left">

                    <button>
                        <img src={home}  style={{height: '25px', width: '25px'}} alt="..." />
                    </button>

                    <button className="TutorCollabDeleteBtn">
                        <img src={del}  style={{height: '25px', width: '25px'}} alt="..." />
                    </button>

                    
                    
                </div>

                <div>

                    <TutorCollabTools />
                    
                </div>
                <div className="right" style={{float: 'right', display: 'flex', justifyContent: 'right'}}>
                    <div>
                        {/* {<span className="digit" id="hr">
                            {hr}</span>
                        <span className="txt">Hr</span>
                        &nbsp;&nbsp;} */}
                        {/* <span className="digit" id="min">
                            {min}</span>
                        <span className="txt">Min</span>
                        &nbsp;&nbsp;
                        <span className="digit" id="sec">
                            {sec}</span>
                        <span className="txt">Sec</span> */}
                        {/* {&nbsp;&nbsp;
                        <span className="digit" id="count">
    {msec}</span>} */}
                        <MyTimer expiryTimestamp={time} />
                    </div>

                    <button onClick={handleAsidePanel}>
                        {PanelChangeBool ? PanelChangeMssg[1] : PanelChangeMssg[0]}
                    </button>
                </div>
            </div>
        </>
     );
}
 
export default TutorCollabHeader;