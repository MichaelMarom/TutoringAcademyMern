import React from 'react'

export const Header = ({ selectedChat }) => {
    return (
        <div className="ks-header">
            <div className="ks-description">
                <div className="ks-name">{selectedChat.name}</div>
                <div className="ks-amount">Typing ....</div>
            </div>
        </div>
    )
}
