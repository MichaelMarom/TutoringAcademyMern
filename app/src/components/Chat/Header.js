import React from 'react'

export const Header = ({ selectedChat }) => {
    return (
        <div className="ks-header d-flex justify-content-start">
            <img src={selectedChat.avatarSrc} className='rounded-circle' 
            style={{ marginRight: "10px", width: "60px", height: "60px" }} alt="avatar" />
            <div className="ks-description">
                <div className="ks-name">{selectedChat.name}</div>
                <div className="ks-amount">{selectedChat.state ? selectedChat.state : 'Offline'}</div>
            </div>
        </div>
    )
}
