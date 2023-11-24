import { useEffect, useState } from 'react';
import AcctSetup from './AcctSetting';
import TutorAcct from './TutorAcct';

 
const Accounting = () => {
    

    let [activeSubTab, setActiveSubTab] = useState()
    let [tabNum, setTabNum] = useState(0)

    useEffect(() => {
        setActiveSubTab(<TutorAcct />)
    }, [])


    useEffect(() => {
        
    }, [activeSubTab])
    return ( 
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>

            <div className="tutor-acct-tab-menu" style={{height: '50px', padding: '10px', cursor: 'pointer', width: '100%', background: '#212F3D', display: 'flex', alignItems: 'center', justifyContent: 'left', marginTop: '5px'}}>  

                <ul id="tutor-header-menus" class="header">
                    <li id='tutor-acct-tab-menu-list-active' onClick={e => {
                        e.currentTarget.nextElementSibling?.removeAttribute('id')
                        e.currentTarget?.setAttribute('id', 'tutor-acct-tab-menu-list-active')
                        setActiveSubTab(<TutorAcct />)
                    }}><a>Account Settings</a></li>
                    <li onClick={e => {
                        e.currentTarget.previousElementSibling?.removeAttribute('id')
                        e.currentTarget?.setAttribute('id', 'tutor-acct-tab-menu-list-active')
                        setActiveSubTab(<AcctSetup />)
                    }}><a>Tutor Account</a></li>
                </ul>

                {/*<div id='tutor-tab-header-list-active' onClick={e => setActiveSubTab(<AcctSetup />)}  style={{color: '#fff', padding: '5px', fontWeight: 'bold', margin: '0 8px 0 8px'}}>Account Setup</div>
                <div onClick={e => setActiveSubTab(<TutorAcct />)} style={{color: '#fff', fontWeight: 'bold', padding: '5px', margin: '0 8px 0 8px'}}>Tutor Account</div>*/}
            </div>
            {
                activeSubTab
            }
        </>
     );
}
 
export default Accounting;