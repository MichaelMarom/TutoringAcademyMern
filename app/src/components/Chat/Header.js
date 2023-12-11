import React from 'react'

export const Header = ({ selectedChat }) => {
    console.log(selectedChat)
    return (
        <div className="ks-header">
            <div className="ks-description">
                <div className="ks-name">{selectedChat.name}</div>
                <div className="ks-amount">{selectedChat.state ? selectedChat.state : 'Offline'}</div>
            </div>
        </div>
    )
}
