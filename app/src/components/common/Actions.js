import React from 'react';
import Button from './Button';
import { useLocation, useNavigate } from 'react-router-dom';

const actionsStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'white',
    borderTop: '1px solid #ccc',
    padding: '10px',
};

const Actions = ({
    saveDisabled = false,
    editDisabled = true,
    backDisabled = false,
    nextDisabled = false,
    loading = false,
    unSavedChanges = false,
    onSave = () => { },
    onEdit = () => { },
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname.split('/')[2];

    const tabsNavigationInfo = [
        { next: "setup", current: "intro", back: null },
        { next: "education", current: "setup", back: "intro" },
        { next: "rates", current: "education", back: "setup" },
        { next: "accounting", current: "rates", back: "education" },
        { next: "subjects", current: "accounting", back: "rates" },
        { next: "my-students", current: "subjects", back: "accounting" },
        { next: "scheduling", current: "my-students", back: "subjects" },
        { next: "term-of-use", current: "scheduling", back: "my-students" },
        { next: "chat", current: "term-of-use", back: "scheduling" },
        { next: "market-place", current: "chat", back: "term-of-use" },
        { next: "collaboration", current: "market-place", back: "chat" },
        { next: null, current: "collaboration", back: "market-place" },
    ]
    console.log(currentTab, location.pathname)
    const currentTabInfo = tabsNavigationInfo.find(tab => tab.current === currentTab)
    const isNextTabExist = currentTabInfo.next;
    const isBackTabExist = currentTabInfo.back;

    const onNext = () => {
        navigate(`/tutor/${currentTabInfo.next}`)
    }

    const onBack = () => {
        navigate(`/tutor/${currentTabInfo.back}`)
    }

    return (
        <div style={actionsStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-1">
                        <button type='button' onClick={onBack} className="btn btn-secondary"
                            disabled={unSavedChanges || loading || backDisabled || !isBackTabExist}>Back</button>
                    </div>
                    <div className="col-1">
                        <button onClick={onEdit} type='button' className="btn btn-warning" disabled={editDisabled}>Edit</button>
                    </div>
                    <div className="col-1">
                        <Button handleClick={onSave} className={`btn btn-primary 
                        ${unSavedChanges ? 'blinking-button' : ''}`} type="submit" loading={loading}
                            disabled={saveDisabled || loading} >
                            Save
                        </Button>
                    </div>
                    <div className="col-1">
                        <button onClick={onNext} disabled={unSavedChanges || loading || nextDisabled || !isNextTabExist}
                            type='button' className="btn btn-success">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actions
