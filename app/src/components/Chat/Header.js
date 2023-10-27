import React from 'react'

export const Header = () => {
    return (
        <div className="ks-header">
            <div className="ks-description">
                <div className="ks-name">Chat name</div>
                <div className="ks-amount">2 members</div>
            </div>
            <div className="ks-controls">
                <div className="dropdown">
                    <button className="btn btn-primary-outline ks-light ks-no-text ks-no-arrow" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="la la-ellipsis-h ks-icon"></span>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right ks-simple" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">
                            <span className="la la-user-plus ks-icon"></span>
                            <span className="ks-text">Add members</span>
                        </a>
                        <a className="dropdown-item" href="#">
                            <span className="la la-eye-slash ks-icon"></span>
                            <span className="ks-text">Mark as unread</span>
                        </a>
                        <a className="dropdown-item" href="#">
                            <span className="la la-bell-slash-o ks-icon"></span>
                            <span className="ks-text">Mute notifications</span>
                        </a>
                        <a className="dropdown-item" href="#">
                            <span className="la la-mail-forward ks-icon"></span>
                            <span className="ks-text">Forward</span>
                        </a>
                        <a className="dropdown-item" href="#">
                            <span className="la la-ban ks-icon"></span>
                            <span className="ks-text">Spam</span>
                        </a>
                        <a className="dropdown-item" href="#">
                            <span className="la la-trash-o ks-icon"></span>
                            <span className="ks-text">Delete</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
