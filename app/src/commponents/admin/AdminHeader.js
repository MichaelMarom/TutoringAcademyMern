import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()
    
    let handleTabClick = e => {
        let clickedElem = e.target;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'active')

        nav(`admin/${e.target.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="form-header shadow-sm">
                <ul>
                    <li data-url='tutor-data' onClick={handleTabClick} id="active">Tutor</li>
                    <li data-url='student-data' onClick={handleTabClick} >Student</li>
                    <li data-url='emai-prog' onClick={handleTabClick} >Email Prog</li>
                    <li data-url='new-subject' onClick={handleTabClick} >New Subject</li>
                    <li data-url='accounting' onClick={handleTabClick} >Accounting</li>
                    <li data-url='communications' onClick={handleTabClick} >Communications </li>
                </ul>
            </div>
        </>
     );
}
 
export default Header;