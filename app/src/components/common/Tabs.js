import React, { useState } from 'react'

const Tabs = ({ links, activeTab, setActiveTab }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const handleTabClick = (index, component) => {
        setActiveTab(component);
        setActiveTabIndex(index)
    };

    return (
        <div className="tutor-acct-tab-menu"
            style={{
                height: '50px', padding: '10px', cursor: 'pointer', width: '100%',
                background: '#212F3D', display: 'flex', alignItems: 'center',
                justifyContent: 'left', marginTop: '5px'
            }}
        >
            
            <ul id="tutor-header-menus" className="header">
                {links.map((tab, index) => (
                    <li
                        id={`${activeTabIndex === index ? 'tutor-acct-tab-menu-list-active' : ""}`}
                        key={index}
                        onClick={() => handleTabClick(index, tab.component)}
                        className={index === activeTab ? 'active' : ''}
                    >
                        <a>{tab.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tabs