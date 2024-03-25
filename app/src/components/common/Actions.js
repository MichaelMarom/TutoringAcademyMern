import React from 'react';
import Button from './Button';
import BTN_ICON from '../../images/button__icon.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { STEPS } from '../../constants/constants';

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
    SaveText = 'Save',
    loading = false,
    unSavedChanges = false,
    onSave = () => { },
    onEdit = () => { },
}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { tutor } = useSelector(state => state.tutor)
    const currentTab = location.pathname.split('/')[2];
    const currentUser = location.pathname.split('/')[1];
    const isStudentSide = currentUser === 'student'

    const tutorTabsNavigationInfo = [
        { next: "setup", current: "intro", back: null, withRole: true },
        { next: "education", current: "setup", back: "intro", withRole: true },
        { next: "rates", current: "education", back: "setup", withRole: true },
        { next: "accounting", current: "rates", back: "education", withRole: true },
        { next: "subjects", current: "accounting", back: "rates", withRole: true },

        { next: "scheduling", current: "subjects", back: "accounting", withRole: true },
        { next: "feedback", current: "scheduling", back: "subjects", withRole: true },
        { next: "my-students", current: "feedback", back: "scheduling", withRole: true },
        { next: "term-of-use", current: "my-students", back: "feedback", withRole: true },
        { next: "chat", current: "term-of-use", back: "my-students", withRole: true },
        { next: "market-place", current: "chat", back: "term-of-use", withRole: true },
        { next: "/collab/123321", current: "market-place", back: "chat", withRole: false },
        { next: `tutor-profile/${tutor.AcademyId}`, current: "/collab/123321", back: "market-place", withRole: true },
        { next: null, current: `tutor-profile`, back: "/collab/123321", withRole: true },
    ]

    const studentTabsNavigationInfo = [
        { next: "setup", current: "intro", back: null, withRole: true },
        { next: "faculties", current: "setup", back: "intro", withRole: true },
        { next: "short-list", current: "faculties", back: "setup", withRole: true },
        { next: "accounting", current: "short-list", back: "faculties", withRole: true },
        { next: "feedback", current: "accounting", back: "short-list", withRole: true },
        { next: "calender", current: "feedback", back: "accounting", withRole: true },
        { next: "term-of-use", current: "calender", back: "feedback", withRole: true },
        { next: "chat", current: "term-of-use", back: "calender", withRole: true },
        { next: "market-place", current: "chat", back: "term-of-use", withRole: true },
        { next: "/collab/123321", current: "market-place", back: "chat", withRole: true },
        { next: `profile`, current: "/collab/123321", back: "market-place", withRole: false },
        { next: null, current: "profile", back: "/collab/123321", withRole: true },
        { next: null, current: `tutor-profile`, back: null, withRole: true },
    ]

    const currentTabInfo = (isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo).
        find(tab => tab.current === currentTab)

    const isNextTabExist = currentTabInfo.next;
    const isBackTabExist = currentTabInfo.back;

    const onNext = () => {
        currentTabInfo.withRole ? navigate(`/${currentUser}/${currentTabInfo.next}`) :
            navigate(`${currentTabInfo.next}`)
    }

    const onBack = () => {
        currentTabInfo.withRole ? navigate(`/${currentUser}/${currentTabInfo.back}`) :
            navigate(`${currentTabInfo.back}`)
    }

    return (
        <div style={actionsStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="" style={{ width: "10%" }}>
                        <button type='button' onClick={onBack} className="back-btn action-btn btn"
                            disabled={!saveDisabled && (unSavedChanges || loading || backDisabled || !isBackTabExist)}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text"><FaChevronLeft />  Back</p>
                            </div>
                        </button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <button onClick={onEdit} type='button' className="edit-btn action-btn btn"
                            disabled={editDisabled}>
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text">Edit</p>
                            </div>
                        </button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <Button handleClick={onSave} className={`save-btn action-btn btn 
                        ${(unSavedChanges && !saveDisabled) ? 'blinking-button saving-btn' : ''}`} type="submit" loading={loading}
                            disabled={saveDisabled || loading} >
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} style={{
                                        animation: loading ? "spin 2s linear infinite" : 'none',
                                    }} />
                                </div>
                                <p className="button__text">{SaveText}</p>
                            </div>
                        </Button>
                    </div>
                    <div className="" style={{ width: "10%" }}>
                        <button onClick={onNext}
                            disabled={(!saveDisabled && (unSavedChanges || loading))
                                || !isNextTabExist || nextDisabled ||
                                currentTab === STEPS[tutor.Step] && !isStudentSide}
                            type='button' className="next-btn action-btn btn">
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} />
                                </div>
                                <p className="button__text">Next <FaChevronRight /> </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actions
