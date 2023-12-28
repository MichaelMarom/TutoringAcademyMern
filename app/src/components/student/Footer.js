import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setSaveTo } from "../../redux/tutor_store/save";


const Footer = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let location = useLocation();

    let urls = [
        'intro','setup','faculties','short-list','accounting','calender-scheduling','message-board','market-place','collaboration','student-profile'
    ]

    let next = () => {
        if(eval(window.localStorage.getItem('student_tab_index')) <= 9){
            let index = eval(window.localStorage.getItem('student_tab_index'))
            let new_index = index + 1;
            window.localStorage.setItem('student_tab_index', new_index)
            console.log(typeof index)

            navigate(`student/${urls[new_index]}`)
        }
    }

    let back = () => {
        if(eval(window.localStorage.getItem('student_tab_index')) >= 1){
            let index = eval(window.localStorage.getItem('student_tab_index'))
            let new_index = index - 1;
            window.localStorage.setItem('student_tab_index', new_index)
            navigate(-1)
        } 
    }

  
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li className="p-1" ><button className="btn btn-primary fs-4 m-0"  onClick={back}>Back</button></li>
                    
                    <li className="p-1" id="student-edit" ><button className="btn btn-secondary fs-4 m-0" >Edit</button></li>
                    
                    <li className="p-1" id="student-save" ><button className="btn btn-success fs-4 m-0"  >Save</button></li>

                    <li className="next p-1" ><button className="btn btn-secondary fs-4 m-0"  onClick={next}>Next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;