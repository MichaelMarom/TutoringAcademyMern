import { useCallback, useEffect, useState } from "react";
// import Calendar from 'react-calendar';
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEventForm from "./CustomEventForm";
import Events from "./Events";
import EventModal from "../common/EventModal";
import { hours, days } from "../../constants/constants";
const localizer = momentLocalizer(moment);
const Scheduling = () => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });
  const [view, setView] = useState(Views.MONTH);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("month");
  const disabledDateRange = {
    start: new Date(2023, 8, 15),
    end: new Date(2023, 8, 20),
  };
  const handleDateClick = (slotInfo) => {
    console.log("handleDateClick", slotInfo);
    if (
      slotInfo.start.getTime() >= disabledDateRange.start.getTime() &&
      slotInfo.end.getTime() <= disabledDateRange.end.getTime()
    ) {
      // This range is disabled, so you can prevent the selection
      alert("This date range is disabled.");
      return;
    }
    setIsModalOpen(true);
    setSelectedDate(slotInfo.start.toString());
  };
  const handleCreateEvent = () => {
    const newEvent = {
      title: eventDetails.title,
      allDay: eventDetails.allDay,
      start: eventDetails.start,
      end: eventDetails.end,
    };
    console.log(`Create event`, events);
    // Update the events array with the new event
    setEvents([...events, newEvent]);
    console.log(`Update events`, events);
    // Close the modal and reset the event details
    setIsModalOpen(false);
    setEventDetails({
      title: "",
      allDay: true,
      start: null,
      end: null,
    });
  };
  

  const dayPropGetter = useCallback(
    (date) => {
      // Check if the date falls within the disabled date range
      if (date >= disabledDateRange.start && date <= disabledDateRange.end) {
        // Date is within the disabled date range
        return {
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault(); // Prevent interaction with disabled dates
            // alert('This date is disabled.');
          },
        };
      }

      // Default styling for other dates
      return {};
    },
    [disabledDateRange]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };
  const handleTabClick = (tab) => {
    // tab=='day' ? setView(Views.DAY) : setView(Views.MONTH);
    console.log(view);
    setActiveTab(tab);
  };
  function isDateDisabled(date) {
    // Add your logic to determine if the date should be disabled
    // For example, you can compare the date to a list of disabled dates
    console.log("date", date);
    const disabledDates = [new Date(2023, 9, 5), new Date(2023, 9, 10)];
    console.log(disabledDates.includes(date));
    return disabledDates.includes(date) ? "disabled-date" : null;
  }
  useEffect(() => {
    let next = document.querySelector(".tutor-next");

    if (next.hasAttribute("id")) {
      next.removeAttribute("id");
    }
    console.log("Events updated:", events);
  }, [events, view]);
  return (
    <>
      <div className="form-scheduling">
        <ul className="nav nav-tabs">
          <li
            className={`nav-item ${activeTab === "month" ? "active" : ""}`}
            onClick={() => handleTabClick("month")}
          >
            <a className="nav-link">Months</a>
          </li>
          <li
            className={`nav-item ${activeTab === "day" ? "active" : ""}`}
            onClick={() => handleTabClick("day")}
          >
            <a className="nav-link">Days</a>
          </li>
        </ul>
        <div className="time-period">
          <div id="form-scheduling-cnt" className="form-scheduling-cnt-month">
            <div className="tab-content">
              <div
                className={`tab-pane ${activeTab === "month" ? "active" : ""}`}
                id="months"
              >
                <div className="form-scheduling-cnt-left">
                  <h6>Black out days</h6>

                  <div className="highlight">
                    Checkbox the date that you are not tutoring. students will
                    not be able to setup lessons for your blacked out days
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
                    {days.map((day, index) => (
                      <div className="form-check" key={index}>
                        <input
                          type="checkbox"
                          id={day.toLowerCase()}
                          className="form-check-input"
                          onChange={() => {}}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={day.toLowerCase()}
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="highlight">
                    Double click on a blocke dout day or hour. Will unblock the
                    day or hour for that day or time.
                  </div>
                </div>
              </div>
              <div
                className={`tab-pane ${activeTab === "day" ? "active" : ""}`}
                id="days"
              >
                <div className="form-scheduling-cnt-left">
                  <h6>Black out hours</h6>

                  <div className="highlight">
                    CheckBox the Hours that you are not tutoring. students will
                    not be able to setup lessons for your blacked out hours
                  </div>

                  <div className="form-scheduling-hours">
                    {hours.map((hour, index) => (
                      <div className="form-check" key={index}>
                        <input
                          type="checkbox"
                          id={`hour-${index}`}
                          className="form-check-input"
                          onChange={() => {}}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`hour-${index}`}
                        >
                          {hour}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="highlight mt-3">
                    Double click on a blocke dout day or hour. Will unblock the
                    day or hour for that day or time.
                  </div>
                </div>
              </div>
            </div>

            <div className="form-scheduling-cnt-right">
              <div className="form-scheduling-cnt-right-header"></div>

              <Calendar
                localizer={localizer}
                events={events}
                selectable
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", width: "100%" }}
                onSelectSlot={handleDateClick}
                dayPropGetter={dayPropGetter}
              />
              <EventModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                selectedDate={selectedDate}
                eventDetails={eventDetails}
                setEventDetails={setEventDetails}
                onCreateEvent={handleCreateEvent}
              />
            </div>
          </div>

          {/* <div className="form-scheduling-cnt-day">
            <div className="form-scheduling-cnt-left">
              <h6>Black out days</h6>

              <div className="highlight">
                Checkbox the date that you are not tutoring. students will not
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
                Double click on a blocke dout day or hour. Will unblock the day
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
