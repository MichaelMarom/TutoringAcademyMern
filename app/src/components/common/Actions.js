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
        { next: `tutor-profile/${tutor.AcademyId}`, current: "collaboration", back: "market-place" },
        { next: null, current: `tutor-profile`, back: "collaboration" },
    ]

    const studentTabsNavigationInfo = [
        { next: "setup", current: "intro", back: null },
        { next: "faculties", current: "setup", back: "intro" },
        { next: "short-list", current: "faculties", back: "setup" },
        { next: "accounting", current: "short-list", back: "faculties" },
        { next: "feedback", current: "accounting", back: "short-list" },
        { next: "calender", current: "feedback", back: "accounting" },
        { next: "term-of-use", current: "calender", back: "feedback" },
        { next: "term-of-use", current: "term-of-use", back: "calender" },
        { next: "market-place", current: "chat", back: "term-of-use" },
        { next: "collaboration", current: "market-place", back: "chat" },
        { next: `profile`, current: "collaboration", back: "market-place" },
        { next: null, current: "profile", back: "collaboration" },
        { next: null, current: `tutor-profile`, back: null },
    ]

    const currentTabInfo = (isStudentSide ? studentTabsNavigationInfo : tutorTabsNavigationInfo).find(tab => tab.current === currentTab)

    const isNextTabExist = currentTabInfo.next;
    const isBackTabExist = currentTabInfo.back;

    const onNext = () => {
        navigate(`/${currentUser}/${currentTabInfo.next}`)
    }

    const onBack = () => {
        navigate(`/${currentUser}/${currentTabInfo.back}`)
    }

    return (
        <div style={actionsStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="" style={{ width: "10%" }}>
                        <button type='button' onClick={onBack} className="back-btn action-btn btn"
                            disabled={unSavedChanges || loading || backDisabled || !isBackTabExist}>
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
                        ${(unSavedChanges && !saveDisabled) ? 'blinking-button' : ''}`} type="submit" loading={loading}
                            disabled={saveDisabled || loading} >
                            <div className="button__content">
                                <div className="button__icon">
                                    <img src={BTN_ICON} alt={"btn__icon"} style={{
                                        animation: loading ? "spin 2s linear infinite" : 'none',
                                    }} />
                                </div>
                                <p className="button__text">Save</p>
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
