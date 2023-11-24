import { useEffect, useState } from "react";
import { get_student_market_data } from "../../axios/student";
import { G } from "@react-pdf/renderer";
import Ads from "./Ads";

const StudentMarketPlace = () => {

    let [activeTab, setActiveTab] = useState('')

    let handleActiveOption = e => {
        let elem = e.currentTarget;

        let src =  elem.dataset.src;

        [...elem.parentElement.children].filter(item => item.hasAttribute('id'))[0]?.removeAttribute('id')
        elem?.setAttribute('id', 'student-market-place-header-active');

        if(src === 'ads'){
            setActiveTab(<Ads />)
        }else{
            setActiveTab('')
        }


    }
    
    

    return ( 
        
        <>
           <div className="student-market-place-header">
                <ul>
                    <li onClick={handleActiveOption} id="student-market-place-header-active"><a>The market place</a></li>
                    <li data-src='ads'  onClick={handleActiveOption}><a>Advertise</a></li>
                    <li onClick={handleActiveOption}><a>Tutor's bid</a></li>
                </ul>
            </div>

            {
                activeTab
            }


        </>
     );
}
 
export default StudentMarketPlace;