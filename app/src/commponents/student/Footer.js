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
                    <li style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={back}>back</button></li>
                    
                    <li id="student-clear" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={clear}>Clear records</button></li>

                    <li id="student-edit" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}}>edit</button></li>
                    
                    <li id="student-save" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={save}>save</button></li>

                    <li className="next" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;