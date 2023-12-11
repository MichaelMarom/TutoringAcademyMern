import React from 'react';

function DiscussionItem({ setSelectedChat, name, datetime, message, avatarSrc, unread, groupAmount, id }) {
    return (
        <li className={`ks-item w-100 ${unread ? 'ks-unread' : ''}`}
            onClick={() => setSelectedChat({ id, name, datetime, message, avatarSrc, unread, groupAmount })}
        >
            <div className="ks-body w-100">
                <div className="ks-name d-flex justify-content-between align-items-center">
                    <h6 className='text-start'>  {name}</h6>
                    <span className="ks-datetime">{datetime}</span>
                </div>
                <div className="ks-message d-flex ">
                    <img src={avatarSrc} width="18" height="18" className="rounded-circle" alt="User Avatar" />
                    <p> {message}</p>
                </div>
            </div>
        </li>
    );
}

function DiscussionList({ discussions, setSelectedChat }) {
    return (
        <div className="ks-body jspScrollable" data-auto-height=""
            style={{ overflowY: 'auto', overflowX: "hidden", padding: '0px', width: '339px' }} tabIndex="0">
            <div className="jspContainer" style={{ width: '339px', height: '550px' }}>
                <div className="jspPane" style={{ padding: '0px', top: '0px', width: '329px' }}>
                    <ul className="ks-items d-flex flex-column">
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
                                id={discussion.id}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function SearchBar() {
    return (
        <div className='border-bottom' >
            <input type="search" className="form-control border-0 m-0" placeholder="Search" style={{ height: "60px" }} />
        </div>
    );
}

export default function Chats({ setSelectedChat, discussionData }) {


    return (
        <div className="ks-discussions">
            <SearchBar />
            <DiscussionList
                setSelectedChat={setSelectedChat}
                discussions={discussionData} />
        </div>
    );
}
