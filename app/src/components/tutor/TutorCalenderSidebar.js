import React, { useState } from 'react';
import { hours, days } from '../../constants/constants'

function TutorCalenderSidebar({
    activeTab,
    setActiveTab,
    disableWeekDays,
    setDisabledWeekDays,
    disabledHours,
    setDisabledHours
}) {
    // const [activeTab, setActiveTab] = useState('month');
    // const [disableWeekDays, setDisabledWeekDays] = useState([]);
    // const [disabledHours, setDisabledHours] = useState([]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleCheckboxClick = (day, timeRange) => {
        if (activeTab === 'month') {
            // Handle checkbox clicks for the 'month' tab
            if (disableWeekDays.includes(day)) {
                setDisabledWeekDays(disableWeekDays.filter((d) => d !== day));
            } else {
                setDisabledWeekDays([...disableWeekDays, day]);
            }
        } else if (activeTab === 'day') {
            // Handle checkbox clicks for the 'day' tab
            if (disabledHours.includes(timeRange)) {
                setDisabledHours(disabledHours.filter((range) => range !== timeRange));
            } else {
                setDisabledHours([...disabledHours, timeRange]);
            }
        }
    };


    return (
        <div className="tab-content card h-100">
            <div className={`h-100 tab-pane ${activeTab === 'month' ? 'active' : ''}`} id="months">
                <div className="form-scheduling-cnt-left h-100">
                    <div className='d-flex'>

                        <button
                            className={`btn btn-sm ${activeTab === 'day' ? 'btn-primary' : 'btn-secondary'
                                }`}
                            onClick={() => handleTabClick('day')}
                        >
                            Blocked Hours
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'month' ? 'btn-primary ' : 'btn-secondary'
                                }`}
                            onClick={() => handleTabClick('month')}
                        >
                            Blooked Week Days
                        </button>
                    </div>
                    <div className="highlight small lh-sm">
                        Checkbox the Day you are not tutoring. Students will
                        not be able to book lessons for your blocked day(s).
                    </div>

                    <div className="form-scheduling-b-days">
                        {days.map((day, index) => (
                            <div className="form-check" key={index}>
                                <input
                                    type="checkbox"
                                    id={day.toLowerCase()}
                                    className="form-check-input"
                                    checked={disableWeekDays.includes(day)}
                                    onChange={() => handleCheckboxClick(day)}
                                />
                                <label className="form-check-label small" htmlFor={day.toLowerCase()}>
                                    {day}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="highlight small lh-sm">
                        Double click on a blocked day or hour, Will unblock the
                        day or hour for that full day or specific hour.
                    </div>
                </div>
            </div>

            <div className={`tab-pane h-100 ${activeTab === 'day' ? 'active' : ''}`} id="days">
                <div className="form-scheduling-cnt-left flex-column d-flex  justify-content-between h-100">
                    <div className='d-flex'>

                        <button
                            className={`btn btn-sm ${activeTab === 'day' ? ' btn-primary' : 'btn-secondary'
                                }`}
                            onClick={() => handleTabClick('day')}
                        >
                            Blocked Hours
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'month' ? 'btn-primary' : 'btn-secondary'
                                }`}
                            onClick={() => handleTabClick('month')}
                        >
                            Blocked Week Days
                        </button>
                    </div>
                    <div className="highlight small lh-sm">
                        CheckBox the hours that you are not tutoring. Students will
                        not be able to book lessons for your blocked hours.
                    </div>

                    <div className="form-scheduling-hours">
                        {hours.map((timeRange, index) => (
                            <div className="form-check" key={index}>
                                <input
                                    type="checkbox"
                                    id={`hour-${index}`}
                                    className="form-check-input"
                                    checked={disabledHours.includes(timeRange)}
                                    onChange={() => handleCheckboxClick(null, timeRange)}
                                />
                                <label className="form-check-label small lh-sm" htmlFor={`hour-${index}`}>
                                    {timeRange[0]} to {timeRange[1]}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="highlight small lh-sm">
                        Double click on a blocked day or hour. Will unblock the
                        day or hour for that full day or specific hour.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorCalenderSidebar