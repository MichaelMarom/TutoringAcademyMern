import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch } from "react-redux";
import { addEvent, storeEvent } from "../../../redux/tutor_store/EventSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { get_tutor_setup } from "../../../axios/tutor";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}

const ShowCalendar = ({ currentTutor, activeTab, disableWeekDays, disabledHours, setDisabledWeekDays, setDisabledHours }) => {

  const { events: stateEvents } = useSelector(state => state.event);
  const [activeView, setActiveView] = useState(views.MONTH)
  const dispatch = useDispatch();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });

  // const [user, setUser] = useState({role:'tutor', id:"Kolin. P. C1501fa", SID:"2"});
  const [user, setUser] = useState({ role: 'student', id: "Rosemary. W. Cab1220", SID: "2" });
  // const [currentTutor, setCurrentTutor] = useState({ id: "Kolin. P. C1501fa", SID: "2" });

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);

  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);


  //student states
  const [reservedSlots, setReservedSlots] = useState([]);

  const updateTutorDisableRecord = async () => {
    await axios.put(`${process.env.REACT_APP_BASE_URL}/tutor/update/${user.SID}`, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours
    });
  }
  const getTutorSetup = async () => {
    const [result] = await get_tutor_setup(currentTutor.id);
    setEnableHourSlots(JSON.parse(result.enableHourSlots));
    setEnabledDays(JSON.parse(result.enabledDays))
    setDisableDates(JSON.parse(result.disableDates));
    setDisableHourSlots(JSON.parse(result.disableHourSlots));
    setDisabledWeekDays(JSON.parse(result.disableWeekDays));
    setDisabledHours(JSON.parse(result.disableHoursRange));
    console.log(result, 'results')
    setDataFetched(true);
  }

  useEffect(() => {
    getTutorSetup()
  }, [])

  useEffect(() => {
    (activeTab === views.MONTH) ? setActiveView(views.MONTH) : setActiveView(views.WEEK)
  }, [activeTab])

  useEffect(() => {
    if (dataFetched && user.role === 'tutor')
      updateTutorDisableRecord();
  }, [disableDates, disableHourSlots, enableHourSlots, disableWeekDays, dataFetched]);

  const convertToDate = (date) => (date instanceof Date) ? date : new Date(date)

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    const secSlot = moment(slotInfo.start).minutes() === 30;
    let endTime = secSlot ? moment(slotInfo.start).subtract(30, 'minutes').toDate() : slotInfo.end;

    let clickedUpperSlot = moment(slotInfo.end).diff(moment(slotInfo.start), 'days') === 1;
    if (clickedUpperSlot && activeView != views.MONTH) return;
    if (clickedDate.getTime() < (new Date()).getTime()) {
      toast.warning(`Cannot ${user.role === 'tutor' ? 'Disable/Enable ' : "Book/Reserve"} Older Slots`);
      return
    }
    if (slotInfo.action === "doubleClick") {
      if (user.role === "tutor") {
        if (disableWeekDays && disableWeekDays.includes(dayName)) {
          if (activeView !== views.MONTH) {

            if (!enableHourSlots.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
              setEnableHourSlots([...enableHourSlots, slotInfo.start, endTime])
            }
            else {
              const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && convertToDate(date).getTime() !== endTime.getTime());
              setEnableHourSlots(removeEnableHourSlots)
            }
          }
          else {
            if (!enabledDays.some(date => convertToDate(date).getTime() === slotInfo.start.getTime()))
              setEnabledDays([...enabledDays, slotInfo.start])
            else {
              const removeEnableDate = enabledDays.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setEnabledDays(removeEnableDate)
            }
          }
        }
        else {
          if (activeView === views.MONTH) {
            if (!disableDates.some(date => convertToDate(date).getTime() === slotInfo.start.getTime()))
              setDisableDates([...disableDates, slotInfo.start])
            else {
              const removeDisableDate = disableDates.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setDisableDates(removeDisableDate)
            }
          }
          else {
            const existInDisabledDate = disableDates.some((storedDate) => {
              const slotDateMoment = moment(slotInfo.start);
              const storedMomentDate = moment(storedDate);
              return storedMomentDate.isSame(slotDateMoment, 'day')
            });
            if (disabledHours &&
              disabledHours.some((timeRange) => {
                const [start, end] = timeRange;
                return formattedTime >= start && formattedTime < end;
              }) || existInDisabledDate) {
              if (!enableHourSlots.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
                setEnableHourSlots([...enableHourSlots, slotInfo.start, endTime])
              }
              else {
                const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime());
                setEnableHourSlots(removeEnableHourSlots)
              }
              if (disableHourSlots.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() || endTime.getTime() === convertToDate(date).getTime())) {
                const removeDisableHourSlots = disableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
                )
                setDisableHourSlots(removeDisableHourSlots)
              }
            }
            else if (!existInDisabledDate) {
              if (!disableHourSlots.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() || endTime.getTime() === convertToDate(date).getTime())) {
                setDisableHourSlots([...disableHourSlots, slotInfo.start, endTime])
              }
              else {
                const removeDisableHourSlots = disableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
                )
                setDisableHourSlots(removeDisableHourSlots)
              }
            }
          }
        }
      } else if (user.role === "student") {
        if (activeView !== views.MONTH) {
          //slots/month
          const existsinEnabledInMonth = enabledDays.some((arrayDate) => convertToDate(arrayDate).getTime() === clickedDate.getTime());
          const existsinEnabledInWeek = enabledDays.some((arrayDate) => {
            const slotDateMoment = moment(clickedDate);
            const arrayMomentDate = moment(arrayDate);
            return arrayMomentDate.isSame(slotDateMoment, 'day')
          });

          const isDisableDate = disableDates.some(storeDate => {
            const slotDateMoment = moment(clickedDate);
            const storedMomentDate = moment(storeDate);
            return storedMomentDate.isSame(slotDateMoment, 'day')
          })
          //slots week/days
          const existInDisableHourSlots = disableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime());
          const existInEnableSlots = enableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime())

          //student general
          const existInReservedSlots = reservedSlots.some(dateTime => convertToDate(dateTime).getTime() === clickedDate.getTime())
          if (existInEnableSlots) {
            if (existInReservedSlots) {
              const removeReservedSlots = reservedSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
              )
              setReservedSlots(removeReservedSlots)
            }
            else setReservedSlots([...reservedSlots, clickedDate, endTime])
          }
          else if (disableWeekDays.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
            alert("This slot is disabled.");
          }
          else if (existInDisableHourSlots || !existInEnableSlots && disabledHours.some((timeRange) => {
            const [start, end] = timeRange;
            return formattedTime === start;
          })) {
            alert("This slot is disabled.");
          }
          else {
            if (existInReservedSlots) {
              const removeReservedSlots = reservedSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
              )
              setReservedSlots(removeReservedSlots)
            }
            else setReservedSlots([...reservedSlots, clickedDate, endTime])
          }
        }
      }

      return;
    } else if (slotInfo.action === "click") {
      if (user.role === "student") {
      }
    }
  };
  // const handleCreateEvent = (newEventDetails) => {
  //   const newEvent = {
  //     title: newEventDetails.title,
  //     allDay: newEventDetails.allDay,
  //     start: newEventDetails.start,
  //     end: newEventDetails.end,
  //   };

  //   // Add API Call Here


  //   setEvents([...events, newEvent]);
  //   setEventDetails({
  //     title: "",
  //     allDay: true,
  //     start: null,
  //     end: null,
  //   });
  // };
  const handleCreateEvent = async (newEventDetails) => {
    const result = await dispatch(addEvent(newEventDetails));
    setEventDetails({
      title: "",
      allDay: true,
      start: null,
      end: null,
    });
  };

  const dayPropGetter = useCallback(
    (date) => {
      const dayName = moment(date).format("dddd");

      const existsinEnabledInMonth = enabledDays.some((arrayDate) => convertToDate(arrayDate).getTime() === date.getTime());
      const existsinEnabledInWeek = enabledDays.some((arrayDate) => {
        const slotDateMoment = moment(date);
        const arrayMomentDate = moment(arrayDate);
        return arrayMomentDate.isSame(slotDateMoment, 'day')
      });

      const isDisableDate = disableDates.some(storeDate => {
        const slotDateMoment = moment(date);
        const storedMomentDate = moment(storeDate);
        return storedMomentDate.isSame(slotDateMoment, 'day')
      })
      if (date.getTime() >= (new Date()).getTime() && disableWeekDays && disableWeekDays.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
        return {
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault();
          },
        };
      }
      return {};
    },
    [disableWeekDays, enabledDays, disableDates]
  );
  const handleEventClick = (event) => {
    // 'event' will contain details of the clicked event
    // Convert event.start and event.end to Date objects
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    // Create a string to display event details in ISO 8601 format
    const eventDetailsString = `
      Event Title: ${event.title}
      Start: ${startDate.toLocaleString()}
      End: ${endDate.toLocaleString()}
    `;
    // Display event details in an alert or a modal
    alert(eventDetailsString);
    // You can also customize the way you want to display the details, such as in a modal dialog
  };
  const slotPropGetter = useCallback((date) => {
    if (date && moment(date).isSame(moment(date), 'day')) {
      const formattedTime = moment(date).format('h:00 a');
      //student checks
      const existsinReservedSlots = reservedSlots.some(slot => convertToDate(slot).getTime() === date.getTime())

      //tutor checks
      const existInEnableSlots = enableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime())

      const existInDisableHourSlots = disableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime());
      if (existsinReservedSlots) {
        return {
          className: 'reserved-slot'
        }
      }
      else if (existInDisableHourSlots) {
        return {
          className: 'disable-slot',
        }
      }
      else if (date.getTime() >= (new Date()).getTime() && disabledHours && disabledHours.some((timeRange) => {
        const [start, end] = timeRange;
        return formattedTime === start;
      }) && !existInEnableSlots && !existInDisableHourSlots) {
        return {
          className: 'disabled-slot',
          onClick: () => { window.alert('This slot is disabled.'); }
        };
      }
      else if (existInEnableSlots) {
        return {
          className: 'enable-slot',
        }
      }

    }
    return {};
  }, [disabledHours, enableHourSlots, disableHourSlots, reservedSlots]);

  const handleViewChange = (view) => {
    setActiveView(view)
  }

  if (!dataFetched)
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border" role="status">
        </div>
      </div>
    )
  return (
    <div className="h-100">
      <Calendar
        views={["day", "week", "month"]}
        localizer={localizer}
        selectable={true}
        defaultView={activeView}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "60vh", width: "100%" }}
        step={30}
        onSelectSlot={handleDateClick}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        onSelectEvent={handleEventClick}
        onView={handleViewChange}
      />
      {/* <EventModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        selectedDate={selectedDate}
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
        onCreateEvent={handleCreateEvent}
      /> */}
    </div>
  );
};
export default ShowCalendar;