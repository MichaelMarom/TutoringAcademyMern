import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()
    
    let handleTabClick = e => {
        let clickedElem = e.target;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'active')

        nav(`student/${e.target.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="form-header shadow-sm">
                <ul>
                    <li data-url='intro' onClick={handleTabClick} id="active">Introduction</li>
                    <li data-url='setup' onClick={handleTabClick} >Student Setup</li>
                    <li data-url='faculties' onClick={handleTabClick} >Faculties</li>
                    <li data-url='short-list' onClick={handleTabClick} >Short List</li>
                    <li data-url='accounting' onClick={handleTabClick} >Accounting</li>
                    <li data-url='subjects' onClick={handleTabClick} >Calender Scheduling</li>
                    <li data-url='my-students' onClick={handleTabClick} >Message Board</li>
                    <li data-url='market-place' onClick={handleTabClick} >Market place</li>
                    <li data-url='collaboration' onClick={handleTabClick} >Collaboration </li>
                    <li data-url='tutor-profile' onClick={handleTabClick} >Profile</li>
                </ul>
            </div>
        </>
     );
}
 
export default Header;