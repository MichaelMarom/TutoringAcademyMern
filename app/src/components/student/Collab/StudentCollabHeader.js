import { useEffect, useState } from "react";
import home from '../../images/home-vector-svgrepo-com.svg';
import del from '../../images/delete-svgrepo-com.svg';
import { useLocation, useNavigate } from "react-router-dom";
import StudentCollabTools from "./StudentCollabTools";
import { useSelector } from "react-redux";
import { getBookedSlot } from "../../../axios/student";
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
    
    

    useEffect(() => {
        getBookedSlot(window.localStorage.getItem('student_user_id'))
        .then(({data}) => {
            let book = []
            data.map(item => {
                let result = JSON.parse(item.bookedSlots)[0].start;
                let setDate = new Date(result)
                let newDate = new Date()

                //let output = newDate - setDate;
                console.log(setDate.toTimeString(),newDate.toLocaleString())
            })

            if(book.length > 1){

            }
        })
        .catch(err => {
            console.log(err)
        })
    },[])

    return ( 
        <>
            <div className="StudentCollabHeader" style={{marginTop: '3px'}}>
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