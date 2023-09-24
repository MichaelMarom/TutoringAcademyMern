import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setSaveTo } from "../../redux/tutor_store/save";


const Footer = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let location = useLocation();

    let urls = [
        'intro','setup','education','rates','accounting','subjects','my-students','scheduling','term-of-use','market-place','collaboration','tutor-profile'
    ]

    useEffect(() => {
        if(location.pathname.split('/').splice(-1)[0] === 'setup'){
            document.querySelector('#tutor-clear').style.display = 'flex'
        }else{
            document.querySelector('#tutor-clear').style.display = 'none'

        }
    }, [location])

    let next = () => {
        if(eval(window.localStorage.getItem('tutor_tab_index') <= 11 && window.localStorage.getItem('tutor_tab_index')) < 12){
            let index = eval(window.localStorage.getItem('tutor_tab_index'))
            let new_index = index + 1;
            window.localStorage.setItem('tutor_tab_index', new_index)
            console.log(typeof index)
            let userData = window.localStorage.getItem('tutor_screen_name');
            if(userData !== null){
                navigate(`tutor/${urls[new_index]}`)
            }else{
                alert('Please Save Data')
            }
            
        }
    }

    let back = () => {
        if(eval(window.localStorage.getItem('tutor_tab_index')) >= 1){
            let index = eval(window.localStorage.getItem('tutor_tab_index'))
            let new_index = index - 1;
            window.localStorage.setItem('tutor_tab_index', new_index)
            navigate(-1)
        } 
    }

    let clear = e => {
        document.querySelector('.screen-name').innerHTML = ''
        window.localStorage.setItem('tutor_screen_name', null)
        window.localStorage.setItem('tutor_user_id', null)
        let url = location.pathname
        navigate(`${url}`)
    }

    let save = () => {
        dispatch(setSaveTo(window.localStorage.getItem('tutor_tab_index')));
        if(window.localStorage.getItem('tab_index')=='7') {
            console.log('save tutor');
        }
    }
    //nav(`tutor/${e.target.dataset.url}`)
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li id="tutor-clear" className="p-1"><button type="button" className="btn btn-danger fs-4 m-0" onClick={clear}>Clear records</button></li>
                    
                    <li className="p-1"><button type="button" class="btn btn-primary fs-4 m-0" onClick={back}>back</button></li>

                    <li id="tutor-edit" className="p-1"><button type="button" className="btn btn-secondary fs-4 m-0">edit</button></li>
                    
                    <li id="tutor-save" className="p-1"><button type="button" className="btn btn-secondary fs-4 m-0" onClick={save}>save</button></li>

                    <li className="tutor-next p-1"><button type="button" className="btn btn-success fs-4 m-0" onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;