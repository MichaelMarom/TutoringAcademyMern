
import React from 'react';

const Pill = ({ label, editable, hasIcon = true, icon, color = "primary", width = "inherit", onClick = () => { console.log('hehe') } }) => {
    return (
        <div
            style={{
                gap: "10px", height: "20px", cursor: 'pointer', width,
                transition: 'background-color 0.3s, box-shadow 0.3s',
                pointerEvents: editable ? "auto" : "none"
            }}
            className={` m-2 rounded-pill p-2 d-flex align-items-center 
            justify-content-between border shadow 
            text-bg-${color}`}
            onClick={onClick}
        >
            <p className={`m-0 ${!hasIcon ? 'w-100' : "w-75"}`} style={{
                fontSize: "14px",
                textAlign: !hasIcon ? 'center' : 'start'
            }}> {label}</p>
            {hasIcon && icon}
        </div>
    );
};

export default Pill;
