import { useEffect, useState } from "react";
import home from '../../images/home-vector-svgrepo-com.svg';
import del from '../../images/delete-svgrepo-com.svg';
import { useLocation, useNavigate } from "react-router-dom";
import TutorCollabTools from "./TutorCollabTools";

const TutorCollabHeader = () => {

    let [PanelChangeMssg, setPanelChangeMssg] = useState(['Show Video', 'Hide Video'])
    let [PanelChangeBool, setPanelChangeBool] = useState(true)

    let location = useLocation();
    let navigate = useNavigate();

    let [hr,setHr] = useState(0)
    let [min,setMin] = useState(50)
    let [sec,setSec] = useState(0)
    let [msec,setMsec] = useState(0)

    let timer = false;

    let hour = 0;
    let minute = 50;
    let second = 0;
    let count = 0;

    

    useEffect(() => {
        timer = true;
        stopWatch();
    }, [])
     
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

    function stopWatch() {
        if (timer) {
            count++;
     
            if (count == 100) {
                second--;
                count = 0;
            }
     
            if (second == 0) {
                minute--;
                second = 60;
                window.localStorage.setItem('collabMinuteHand', minute)
            }

            if(minute < 6){
                alert("This lesson is to be finished in 5 minutes.")
            }
     
            // if (minute == 60) {
            //     hour++;
            //     minute = 0;
            //     second = 0;
            //     window.localStorage.setItem('collabHourHand', hour)

            // }
     
            let hrString = window.localStorage.getItem('collabHourHand');
            let minString = window.localStorage.getItem('collabMinuteHand');
            let secString = second;
            let countString = count;
     
            if (hour < 10) {
                hrString = "0" + hrString;
            }
     
            if (minute < 10) {
                minString = "0" + minString;
            }
     
            if (second < 10) {
                secString = "0" + secString;
            }
     
            if (count < 10) {
                countString = "0" + countString;
            }
     
            setHr(hrString);
            setMin(minString);
            setSec(secString);
            setMsec(countString);


            setTimeout(stopWatch, 10);
        }
    }

    let handleAsidePanel = e => {
        setPanelChangeBool(!PanelChangeBool)
        let tutorAsideElem = document.querySelector('.TutorAside');
        if(tutorAsideElem.hasAttribute('id')){
            tutorAsideElem.removeAttribute('id')
        }else{
            tutorAsideElem.setAttribute('id', 'TutorAside')

        }
    }



    
    return ( 
        <>
            <div className="TutorCollabHeader">
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
                <div className="right">
                    <div>
                        {/* {<span className="digit" id="hr">
                            {hr}</span>
                        <span className="txt">Hr</span>
                        &nbsp;&nbsp;} */}
                        <span className="digit" id="min">
                            {min}</span>
                        <span className="txt">Min</span>
                        &nbsp;&nbsp;
                        <span className="digit" id="sec">
                            {sec}</span>
                        <span className="txt">Sec</span>
                        {/* {&nbsp;&nbsp;
                        <span className="digit" id="count">
    {msec}</span>} */}
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