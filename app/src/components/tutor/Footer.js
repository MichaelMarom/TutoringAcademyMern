import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setSaveTo } from "../../redux/tutor_store/save";


const Footer = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let urls = [
        'intro','setup','education','rates','accounting','subjects','my-students','scheduling','term-of-use','market-place','collaboration','tutor-profile'
    ]


    let next = (e) => {

        e.target.disabled = true;

        if(eval(window.localStorage.getItem('tutor_tab_index') <= 11 && window.localStorage.getItem('tutor_tab_index')) < 12){
            let index = eval(window.localStorage.getItem('tutor_tab_index'))
            let new_index = index + 1;
            window.localStorage.setItem('tutor_tab_index', new_index)
            console.log(typeof index)
            let userData = window.localStorage.getItem('tutor_screen_name');
            if(userData !== null){
                navigate(`tutor/${urls[new_index]}`)
                let h = [...document.querySelector('#tutor-header-menus').children];
                let aElem = h.filter(item => item.hasAttribute('id'))[0]
                aElem.removeAttribute('id')
                aElem.nextElementSibling.setAttribute('id', 'tutor-tab-header-list-active')
            }else{
                alert('Please Save Data')
            }
            
        }

        setTimeout(() => {
            e.target.disabled = false;

        }, 3500)


    }

    let back = (e) => {
        e.target.disabled = true;

        if(eval(window.localStorage.getItem('tutor_tab_index')) >= 1){
            let index = eval(window.localStorage.getItem('tutor_tab_index'))
            let new_index = index - 1;
            window.localStorage.setItem('tutor_tab_index', new_index)
            navigate(-1)
            let h = [...document.querySelector('#tutor-header-menus').children];
            let aElem = h.filter(item => item.hasAttribute('id'))[0]
            aElem.removeAttribute('id')
            aElem.previousElementSibling.setAttribute('id', 'tutor-tab-header-list-active')
        } 

        setTimeout(() => {
            e.target.disabled = false;

        }, 3500)
    }


    let save = () => {
        dispatch(setSaveTo(window.localStorage.getItem('tutor_tab_index')));
        if(window.localStorage.getItem('tab_index')=='7') {
            console.log('save tutor');
        }
    }
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li className="p-1"><button type="button" className="btn btn-primary fs-4 m-0" onClick={back}>back</button></li>

                    <li id="tutor-edit" className="p-1"><button type="button" className="btn btn-secondary fs-4 m-0">edit</button></li>
                    
                    <li id="tutor-save" className="p-1"><button type="button" className="btn btn-secondary fs-4 m-0" onClick={save}>save</button></li>

                    <li className="tutor-next p-1"><button type="button" className="btn btn-success fs-4 m-0" onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;