import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Tabs = ({ links, activeTab, setActiveTab, activeTabIndex, setActiveTabIndex }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (index, component) => {
        if (links[index].link)
            return navigate(links[index].link)
        setActiveTab(component);
        setActiveTabIndex(index);

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
                        id={`${(tab.link ? location.pathname === tab.link : index === activeTabIndex) ? 'tutor-acct-tab-menu-list-active' : ""}`}
                        key={index}
                        onClick={() => handleTabClick(index, tab.component)}
                        className={location.pathname === tab.link ? 'active' : ''}
                    >
                        <a>{tab.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Tabs