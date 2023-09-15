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
        window.localStorage.setItem('tutor_screen_name', null)
        window.localStorage.setItem('tutor_user_id', null)
        let url = location.pathname
        navigate(`${url}`)
    }

    let save = () => {
        dispatch(setSaveTo(window.localStorage.getItem('tutor_tab_index')));
    }
    //nav(`tutor/${e.target.dataset.url}`)
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={back}>back</button></li>
                    
                    <li id="tutor-clear" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={clear}>Clear records</button></li>

                    <li id="tutor-edit" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}}>edit</button></li>
                    
                    <li id="tutor-save" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={save}>save</button></li>

                    <li className="tutor-next" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;