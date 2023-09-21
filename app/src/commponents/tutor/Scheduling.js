import { useEffect, useState } from "react";
// import Calendar from 'react-calendar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomEventForm from "./CustomEventForm";
import Events from "./Events";
import DateModal from "./DateModal";

const localizer = momentLocalizer(moment);
const Scheduling = () => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    allDay: true,
    start: null,
    end: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("month");
  const handleDateClick = (slotInfo) => {
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
    console.log(`Create event`,events);
    // Update the events array with the new event
    setEvents([...events, newEvent]);
    
    // Close the modal and reset the event details
    setIsModalOpen(false);
    setEventDetails({
      title: '',
      allDay: true,
      start: null,
      end: null,
    });
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  function isDateDisabled(date) {
    // Add your logic to determine if the date should be disabled
    // For example, you can compare the date to a list of disabled dates
    console.log("date",date);
    const disabledDates = [new Date(2023, 9, 5), new Date(2023, 9, 10)];
    console.log(disabledDates.includes(date));
    return disabledDates.includes(date) ? 'disabled-date' : null;
  }
  useEffect(() => {
    let next = document.querySelector(".tutor-next");

    if (next.hasAttribute("id")) {
      next.removeAttribute("id");
    }
    console.log("Events updated:", events);
  }, [events]);
  return (
    <>
      <div className="form-scheduling">
        <ul className="nav nav-tabs">
          <li
            className={`nav-item ${activeTab === "month" ? "active" : ""}`}
            onClick={() => handleTabClick("month")}
          >
            <a className="nav-link" href="#months">
              Months
            </a>
          </li>
          <li
            className={`nav-item ${activeTab === "day" ? "active" : ""}`}
            onClick={() => handleTabClick("day")}
          >
            <a className="nav-link" href="#days">
              Days
            </a>
          </li>
        </ul>

        <div className="time-period">
          <div id="form-scheduling-cnt" className="form-scheduling-cnt-month">
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
                <div class="form-check">
                  <input type="checkbox" id="sat" class="form-check-input" />
                  <label class="form-check-label" for="sat">
                    Saturday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="sun" class="form-check-input" />
                  <label class="form-check-label" for="sun">
                    Sunday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="mon" class="form-check-input" />
                  <label class="form-check-label" for="mon">
                    Monday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="tues" class="form-check-input" />
                  <label class="form-check-label" for="tues">
                    Tuesday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="wed" class="form-check-input" />
                  <label class="form-check-label" for="wed">
                    Wednesday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="thurs" class="form-check-input" />
                  <label class="form-check-label" for="thurs">
                    Thursday
                  </label>
                </div>

                <div class="form-check">
                  <input type="checkbox" id="fri" class="form-check-input" />
                  <label class="form-check-label" for="fri">
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

              <Calendar
                localizer={localizer}
                events={events}
                selectable
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' , width: '100%' }} 
                onSelectSlot={handleDateClick}
                datePropGetter={isDateDisabled}
              />
              <DateModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                selectedDate={selectedDate}
                eventDetails={eventDetails}
                setEventDetails={setEventDetails}
                onCreateEvent={handleCreateEvent}
              />
            </div>
          </div>

          <div className="form-scheduling-cnt-day">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Scheduling;
