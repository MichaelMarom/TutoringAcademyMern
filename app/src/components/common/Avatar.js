import React from 'react';

const Avatar = ({ avatarSrc, online, size = "50", indicSize="12px" }) => {
    const containerStyle = {
        position: 'relative',
        display: 'inline-block',
    };

    const onlineIndicatorStyle = {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: indicSize,
        height: indicSize,
        borderRadius: '50%',
        backgroundColor: online ? '#28a745' : 'red', // Green for online, gray for offline
        border: '2px solid #ffffff',
    };

    return (
        <div className="avatar-container m-2" style={containerStyle}>
            <img
                src={avatarSrc}
                alt="Avatar"
                className=" rounded-circle "
                width={size}
                height={size}
            />
            <div className="online-indicator" style={onlineIndicatorStyle}></div>
        </div>
    );
};

export default Avatar;
