import { useEffect, useState } from "react";
// import Calendar from 'react-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { days, hours } from "../../constants/constants";
import ShowCalendar from "../common/Calendar/Calendar";
import { getEvents } from "../../redux/tutor_store/EventSlice";
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

  useEffect(() => {
    console.log('dispatching');
    dispatch(getEvents())
  }, [dispatch])

  return (
    <>
      <div className="form-scheduling">
        <ul className="nav nav-tabs overflow-hidden">

          <button className={`btn-sm ${activeTab === "month" ? "btn btn-primary" : "btn btn-light btn-outline-dark"}`}
            onClick={() => handleTabClick("month")}
          >Block days </button>

          <button className={`btn-sm ${activeTab === "day" ? "btn btn-primary" : "btn btn-light btn-outline-dark"}`}

            onClick={() => handleTabClick("day")}>Block hours</button>
        </ul>
        <div className="time-period">
          <div id="form-scheduling-cnt" className="form-scheduling-cnt-month">
            <div className="tab-content">
              <div
                className={`tab-pane ${activeTab === "month" ? "active" : ""}`}
                id="months"
              >
                <div className="form-scheduling-cnt-left">
                  <h6>Block days</h6>

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
                  <h6>Black hours</h6>

                  <div className="highlight small lh-sm">
                    CheckBox the hours that you are not tutoring. students will
                    not be able to book lessons for your blocked hours
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

            <div className="form-scheduling-cnt-right">
              <ShowCalendar disableWeekDays={disableWeekDays} disabledHours={disabledHours} setDisabledWeekDays={setDisabledWeekDays} setDisabledHours={setDisabledHours} />
            </div>
          </div>

          {/* <div className="form-scheduling-cnt-day">
            <div className="form-scheduling-cnt-left">
              <h6>Black out days</h6>

              <div className="highlight">
                Checkbox the day of the week that you are not tutoring. It will block out all days forward. students will not
                be able to setup lessons for your blacked out days
              </div>

              <div
                className="form-scheduling-b-days"
                style={{
                  position: "relative",
                  display: "block",
                  margin: "auto",
                  marginBottom: "35px",
                  width: "50%",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="sat" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="sat"
                  >
                    Saturday
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="sun" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="sun"
                  >
                    Sunday
                  </label>
                </div>

                <div 
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="mon" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="mon"
                  >
                    Monday
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="tues" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="tues"
                  >
                    Tuesday
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="wed" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="wed"
                  >
                    Wednesday
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="thurs" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="thurs"
                  >
                    Thursday
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <input type="checkbox" id="fri" style={{ float: "left" }} />
                  <label
                    style={{ margin: " 0 10px 15px 10px", float: "right" }}
                    htmlFor="fri"
                  >
                    Friday
                  </label>
                </div>
              </div>

              <div className="highlight">
                Double click on a blocked out day or hour. Will unblock the day
                or hour for that day or time.
              </div>
            </div>

            <div className="form-scheduling-cnt-right">
              <div className="form-scheduling-cnt-right-header"></div>

              <div className="form-scheduling-cnt-right-days">
                <ul
                  style={{
                    background: "#0088ff",
                    width: "100%",
                    padding: "0",
                    color: "#fff",
                    margin: "0",
                  }}
                >
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Sunday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Monday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Tuesday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Wednesday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Thursday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Friday
                  </li>
                  <li
                    style={{
                      width: "14.28%",
                      fontWeight: "bold",
                      background: "#0088ff",
                      color: "#fff",
                      margin: "0",
                    }}
                  >
                    Saturday
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Scheduling;
