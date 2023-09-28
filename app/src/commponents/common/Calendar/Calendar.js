import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch } from "react-redux";
import { addEvent, storeEvent } from "../../../redux/tutor_store/EventSlice";
import { useSelector } from "react-redux";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timeZone);

const ShowCalendar = ({ disableWeekdDays, disabledHours }) => {
  const [events, setEvents] = useState([]);
  const { events: stateEvents } = useSelector(state => state.event);
  const [activeView, setActiveView] = useState(views.MONTH)
  const dispatch = useDispatch();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });

  const [user, setuser] = useState("tutor");
  const [selectedDate, setSelectedDate] = useState(null);

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);

  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);

  let formats = {
    timeGutterFormat: 'HH:mm',
  }

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    const secSlot = moment(slotInfo.start).minutes() === 30;
    let endTime = secSlot ? moment(slotInfo.start).subtract(30, 'minutes').toDate() : slotInfo.end;

    if (slotInfo.action === "doubleClick") {
      if (user === "tutor") {
        if (disableWeekdDays && disableWeekdDays.includes(dayName)) {
          if (activeView !== views.MONTH) {

            if (!enableHourSlots.some(date => date.getTime() === slotInfo.start.getTime())) {
              setEnableHourSlots([...enableHourSlots, slotInfo.start, endTime])
            }
            else {
              const removeEnableHourSlots = enableHourSlots.filter(date => date.getTime() !== slotInfo.start.getTime() && date.getTime() !== endTime.getTime());
              setEnableHourSlots(removeEnableHourSlots)
            }
          }
          else {
            if (!enabledDays.some(date => date.getTime() === slotInfo.start.getTime()))
              setEnabledDays([...enabledDays, slotInfo.start])
            else {
              const removeEnableDate = enabledDays.filter(date => date.getTime() !== slotInfo.start.getTime());
              setEnabledDays(removeEnableDate)
            }
          }
          return;
        }
        else {
          if (activeView === views.MONTH) {
            if (!disableDates.some(date => date.getTime() === slotInfo.start.getTime()))
              setDisableDates([...disableDates, slotInfo.start])
            else {
              const removeDisableDate = disableDates.filter(date => date.getTime() !== slotInfo.start.getTime());
              setDisableDates(removeDisableDate)
            }
          }
          else {
            const existInDisabledDate = disableDates.some((storedDate) => {
              const slotDateMoment = moment(slotInfo.start);
              const storedMomentDate = moment(storedDate);
              return storedMomentDate.isSame(slotDateMoment, 'day')
            });
            if (!existInDisabledDate) {
              if (!disableHourSlots.some(date => date.getTime() === slotInfo.start.getTime() || endTime.getTime() === date.getTime())) {
                setDisableHourSlots([...disableHourSlots, slotInfo.start, endTime])
              }
              else {
                console.log('removing', disableHourSlots, slotInfo.start)

                const removeDisableHourSlots = disableHourSlots.filter(date => {
                  console.log(date.getTime() === slotInfo.start.getTime(), 'pered')
                  return date.getTime() !== slotInfo.start.getTime() && endTime.getTime() !== date.getTime()
                })
                setDisableHourSlots(removeDisableHourSlots)
              }
            }

            if (!enableHourSlots.some(date => date.getTime() === slotInfo.start.getTime())) {
              setEnableHourSlots([...enableHourSlots, slotInfo.start, endTime])
            }
            else {
              const removeEnableHourSlots = enableHourSlots.filter(date => date.getTime() !== slotInfo.start.getTime() && endTime.getTime() !== date.getTime());
              setEnableHourSlots(removeEnableHourSlots)
            }
          }
        }
      } else if (user === "student") {
      }
    } else if (slotInfo.action === "click") {
      if (user === "student") {
        if (disableWeekdDays && disableWeekdDays.includes(dayName)) {
          alert("This day is disabled.");
          return;
        }
        if (
          disabledHours &&
          disabledHours.some((timeRange) => {
            const [start, end] = timeRange;
            return formattedTime >= start && formattedTime < end;
          })
        ) {
          alert("This slot is disabled.");
          return;
        }
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

      const existsinEnabledInMonth = enabledDays.some((arrayDate) => arrayDate.getTime() === date.getTime());
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
      if (disableWeekdDays && disableWeekdDays.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
        return {
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault();
          },
        };
      }
      return {};
    },
    [disableWeekdDays, enabledDays, disableDates]
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

      const existInEnableSlots = enableHourSlots.some((dateTime) => dateTime.getTime() === date.getTime())

      const existInDisableHourSlots = disableHourSlots.some((dateTime) => dateTime.getTime() === date.getTime())
      if (existInDisableHourSlots) {
        return {
          className: 'disable-slot',
        }
      }
      else if (disabledHours && disabledHours.some((timeRange) => {
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
  }, [disabledHours, enableHourSlots, disableHourSlots]);

  const handleViewChange = (view) => {
    setActiveView(view)
  }
  return (
    <div className="h-100">
      <Calendar
        views={["day", "week", "month"]}
        localizer={localizer}
        selectable={true}
        formats={formats}
        defaultView="month"
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