import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { days, hours } from "../../constants/constants";
import ShowCalendar from "../common/Calendar/Calendar";
import { useDispatch } from "react-redux";

const Scheduling = () => {

  const [activeTab, setActiveTab] = useState("month");
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [disabledHours, setDisabledHours] = useState([]);
  const dispatch = useDispatch();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleCheckboxClick = (dayName, hourRange) => {
    // Check if the day or hour is already disabled
    const isDayDisabled = disableWeekDays.includes(dayName);
    const isHourDisabled = disabledHours.includes(hourRange);
    if (isDayDisabled) {
      // If both day and hour are already disabled, remove them
      setDisabledWeekDays(disableWeekDays.filter((day) => day !== dayName));
    } else if (isHourDisabled) {
      setDisabledHours(disabledHours.filter((hour) => hour !== hourRange));
    } else {
      // If either day or hour is not disabled, add them
      if (dayName) {
        if (!isDayDisabled) {
          setDisabledWeekDays([...disableWeekDays, dayName]);
        }
      }
      if (hourRange) {
        if (!isHourDisabled) {
          setDisabledHours([...disabledHours, hourRange]);
        }
      }
    }
  };

  useEffect(() => {
    let next = document.querySelector(".tutor-next");

    if (next.hasAttribute("id")) {
      next.removeAttribute("id");
    }
  });



  return (
    <>
      <div className="form-scheduling">
        <div className="time-period">
          <div className='d-flex mt-5' style={{ height: "75vh" }}>
            <div className="px-2 col-3">

              <div className="tab-content">
                <div
                  className={`tab-pane ${activeTab === "month" ? "active" : ""}`}
                  id="months"
                >
                  <div className="form-scheduling-cnt-left">
                    {/* <h6 className="d-inline">Block days</h6> */}

                    <button className={`btn-sm ${activeTab === "day" ? "btn btn-primary" : "btn btn-light btn-outline-dark"}`}

                      onClick={() => handleTabClick("day")}>Block hours</button>
                    {/* </ul> */}
                    <div className="highlight small lh-sm">
                      Checkbox the Day you are not tutoring. Students will
                      not be able to book lessons for your blocked day(s).
                    </div>

                    <div
                      className="form-scheduling-b-days"
                      style={{
                        position: "relative",
                        display: "block",
                        margin: "auto",
                        marginBottom: "15px",
                        width: "50%",
                        background: "#fff",
                      }}
                    >
                      {days.map((day, index) => (
                        <div className="form-check" key={index}>
                          <input
                            type="checkbox"
                            id={day.toLowerCase()}
                            className="form-check-input"
                            checked={disableWeekDays.includes(day)}
                            onChange={() => handleCheckboxClick(day)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={day.toLowerCase()}
                          >
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
                <div
                  className={`tab-pane ${activeTab === "day" ? "active" : ""}`}
                  id="days"
                >
                  <div className="form-scheduling-cnt-left">
                    {/* <h6 className="d-inline">Black hours</h6> */}
                    <button className={`btn-sm ${activeTab === "month" ? "btn btn-primary" : "btn btn-light btn-outline-dark"}`}
                      onClick={() => handleTabClick("month")}
                    >Block days </button>
                    <div className="highlight small lh-sm">
                      CheckBox the hours that you are not tutoring. Students will
                      not be able to book lessons for your blocked hours.
                    </div>

                    <div className="form-scheduling-hours  ">
                      {hours.map((timeRange, index) => (
                        <div className="form-check" key={index}>
                          <input
                            type="checkbox"
                            id={`hour-${index}`}
                            className="form-check-input"
                            checked={disabledHours.includes(timeRange)}
                            onChange={() => handleCheckboxClick(null, timeRange)}
                          />
                          <label
                            className="form-check-label small lh-sm"
                            htmlFor={`hour-${index}`}
                          >
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
            </div>
            <div className='px-5 col-9'>
              <ShowCalendar activeTab={activeTab} disableWeekDays={disableWeekDays} disabledHours={disabledHours} setDisabledWeekDays={setDisabledWeekDays} setDisabledHours={setDisabledHours} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scheduling;
