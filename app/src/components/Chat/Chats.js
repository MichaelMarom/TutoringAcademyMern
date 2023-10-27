import React from 'react';
import { Link } from 'react-router-dom';

function DiscussionItem({ setSelectedChat, name, datetime, message, avatarSrc, unread, groupAmount }) {
    return (
        <li className={`ks-item ${unread ? 'ks-unread' : ''}`}

            onClick={() => setSelectedChat({ name, datetime, message, avatarSrc, unread, groupAmount })}>
            <div>
                {groupAmount && (
                    <span className="ks-group-amount">{groupAmount}</span>
                )}
                <div className="ks-body">
                    <div className="ks-name">
                        {name}
                        <span className="ks-datetime">{datetime}</span>
                    </div>
                    <div className="ks-message">
                        <img src={avatarSrc} width="18" height="18" className="rounded-circle" alt="User Avatar" />
                        {message}
                    </div>
                </div>
            </div>
        </li>
    );
}

function DiscussionList({ discussions, setSelectedChat }) {
    return (
        <div className="ks-body ks-scrollable jspScrollable" data-auto-height="" style={{ height: '400px', overflowY: 'auto', padding: '0px', width: '339px' }} tabIndex="0">
            <div className="jspContainer" style={{ width: '339px', height: '550px' }}>
                <div className="jspPane" style={{ padding: '0px', top: '0px', width: '329px' }}>
                    <ul className="ks-items">
                        {discussions.map((discussion, index) => (
                            <DiscussionItem
                                setSelectedChat={setSelectedChat}
                                key={index}
                                name={discussion.name}
                                datetime={discussion.datetime}
                                message={discussion.message}
                                avatarSrc={discussion.avatarSrc}
                                unread={discussion.unread}
                                groupAmount={discussion.groupAmount}
                            />
                        ))}
                    </ul>
                </div>
                <div className="jspVerticalBar">
                    <div className="jspCap jspCapTop"></div>
                    <div className="jspTrack" style={{ height: '550px' }}>
                        <div className="jspDrag" style={{ height: '261px' }}>
                            <div className="jspDragTop"></div>
                            <div className="jspDragBottom"></div>
                        </div>
                    </div>
                    <div className="jspCap jspCapBottom"></div>
                </div>
            </div>
        </div>
    );
}

function SearchBar() {
    return (
        <div className="ks-search">
            <div className="input-icon icon-right icon icon-lg icon-color-primary">
                <input id="input-group-icon-text" type="text" className="form-control" placeholder="Search" />
                <span className="icon-addon">
                    <span className="la la-search"></span>
                </span>
            </div>
        </div>
    );
}

export default function Chats({ setSelectedChat }) {
    const discussionData = [
        {
            name: 'Group Chat',
            datetime: 'just now',
            message: 'The weird future of movie theater food',
            avatarSrc: 'https://bootdey.com/img/Content/avatar/avatar1.png',
            unread: false,
            groupAmount: 3,
        },
        {
            name: 'Eric George',
            datetime: 'just now',
            message: "Why didn't he come and talk to me...",
            avatarSrc: 'https://bootdey.com/img/Content/avatar/avatar2.png',
            unread: true,
        },
        // Add more discussion items as needed
    ];

    return (
        <div className="ks-discussions">
            <SearchBar />
            <DiscussionList
                setSelectedChat={setSelectedChat}
                discussions={discussionData} />
        </div>
    );
}
