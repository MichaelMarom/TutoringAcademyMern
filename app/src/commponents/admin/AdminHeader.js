import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()
    
    let handleTabClick = e => {
        let clickedElem = e.currentTarget;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'admin-tab-header-list-active')

        nav(`admin/${e.currentTarget.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="admin-tab-header shadow-sm">
                <ul>
                    <li data-url='tutor-data' onClick={handleTabClick} id="admin-tab-header-list-active"><a>Tutor</a></li>
                    <li data-url='student-data' onClick={handleTabClick} ><a>Student</a></li>
                    <li data-url='emai-prog' onClick={handleTabClick} ><a>Email Prog</a></li>
                    <li data-url='new-subject' onClick={handleTabClick} ><a>New Subject</a></li>
                    <li data-url='accounting' onClick={handleTabClick} ><a>Accounting</a></li>
                    <li data-url='communications' onClick={handleTabClick} ><a>Communications </a></li>
                </ul>
            </div>
        </>
     );
}
 
export default Header;