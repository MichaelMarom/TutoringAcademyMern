import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSaveTo } from "../../redux/tutor_store/save";


const Footer = () => {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let urls = [
        'intro','setup','education','rates','accounting','subjects','my-students','scheduling','term-of-use','market-place','collaboration','tutor-profile'
    ]

    let next = () => {
        if(eval(window.localStorage.getItem('tab_index')) <= 11){
            let index = eval(window.localStorage.getItem('tab_index'))
            let new_index = index + 1;
            window.localStorage.setItem('tab_index', new_index)
            console.log(typeof index)

            navigate(`tutor/${urls[new_index]}`)
        }
    }

    let back = () => {
        if(eval(window.localStorage.getItem('tab_index')) >= 1){
            let index = eval(window.localStorage.getItem('tab_index'))
            let new_index = index - 1;
            window.localStorage.setItem('tab_index', new_index)
            navigate(-1)
        } 
    }

    let save = () => {
        dispatch(setSaveTo(window.localStorage.getItem('tab_index')));
    }
    //nav(`tutor/${e.target.dataset.url}`)
    return (
        <>

            <div className="tutor-footer">
                <ul>
                    <li style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={back}>back</button></li>

                    <li style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}}>edit</button></li>
                    
                    <li id="save" style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={save}>save</button></li>

                    <li style={{padding: '5px', color: '#fff', margin: '0 25px 0 25px'}}><button style={{padding: '7px 25px 7px 25px', cursor: 'pointer', color: '#fff', background: 'blue', fontSize: 'large', fontWeight: '500', textTransform: 'capitalize'}} onClick={next}>next</button></li>
                </ul>
            </div>
        </>
    )
}

export default Footer;