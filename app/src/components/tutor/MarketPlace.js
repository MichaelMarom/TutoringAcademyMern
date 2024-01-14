import { useState } from "react";
import Ads from "./Ads";
import Tabs from "../common/Tabs";
import Actions from "../common/Actions";

const StudentMarketPlace = () => {

    let [activeTab, setActiveTab] = useState('')

    const tabs = [
        { label: 'The market place', component: null },
        { label: 'Advertise', component: <Ads /> },
        { label: `Tutor's bid`, component: null },
    ];


    return (
        <>
            <Tabs links={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {activeTab}
           
        </>
    );
}

export default StudentMarketPlace;