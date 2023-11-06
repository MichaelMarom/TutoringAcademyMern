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

    useEffect(() => {
        if(location.pathname.split('/').splice(-1)[0] === 'setup'){
            document.querySelector('#student-clear').style.display = 'flex'
        }else{
            document.querySelector('#student-clear').style.display = 'none'

        }
    }, [location])

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

    let clear = e => {
        window.localStorage.setItem('student_screen_name', null) 
        window.localStorage.setItem('student_user_id', null)
        let url = location.pathname
        navigate(`${url}`)
    }

    let save = () => {
        dispatch(setSaveTo(window.localStorage.getItem('student_tab_index')));
    }
    //nav(`tutor/${e.target.dataset.url}`)
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li className="p-1" ><button className="btn btn-primary fs-4 m-0"  onClick={back}>Back</button></li>
                    
                    <li className="p-1" id="student-clear" ><button className="btn btn-danger fs-4 m-0"  onClick={clear}>Clear records</button></li>

                    <li className="p-1" id="student-edit" ><button className="btn btn-secondary fs-4 m-0" >edit</button></li>
                    
                    <li className="p-1" id="student-save" ><button className="btn btn-success fs-4 m-0"  >save</button></li>

                    <li className="next p-1" ><button className="btn btn-secondary fs-4 m-0"  onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;