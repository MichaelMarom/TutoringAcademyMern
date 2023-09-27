import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch } from "react-redux";
import { addEvent, storeEvent } from "../../../redux/tutor_store/EventSlice";
import { useSelector } from "react-redux";
const localizer = momentLocalizer(moment);
const ShowCalendar = ({ disabledDays, disabledHours }) => {
  const [events, setEvents] = useState([]);
  const { events: stateEvents } = useSelector(state => state.event);
  const dispatch = useDispatch();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });
  const [user, setuser] = useState("tutor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [enabledDays, setEnabledDays] = useState([]);
  const [enablethirtyMinsSlots, setEnablethirtyMinsSlots] = useState([]);

  const handleDateClick = (slotInfo) => {
    console.log('slotclickedDate', slotInfo);
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    if (slotInfo.action === "doubleClick") {
      if (user === "tutor") {
        if (disabledDays && disabledDays.includes(dayName)) {
          setEnabledDays([...enabledDays, slotInfo.slots[0]])
          setEnablethirtyMinsSlots([...enablethirtyMinsSlots, slotInfo.start])
          return;
        }
      } else if (user === "student") {
      }
    } else if (slotInfo.action === "click") {
      if (user === "student") {
        if (disabledDays && disabledDays.includes(dayName)) {
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
  //   setIsModalOpen(false);
  //   setEventDetails({
  //     title: "",
  //     allDay: true,
  //     start: null,
  //     end: null,
  //   });
  // };
  const handleCreateEvent = async (newEventDetails) => {
    const result = await dispatch(addEvent(newEventDetails));
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
      const dayName = moment(date).format("dddd");

      const existsinEnabledInMonth = enabledDays.some((arrayDate) => arrayDate.getTime() === date.getTime());

      if (disabledDays && disabledDays.includes(dayName) && !existsinEnabledInMonth) {
        return {
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault();
          },
        };
      }
      return {};
    },
    [disabledDays, enabledDays]
  );
  const handleEventClick = (event) => {
    console.log('event')
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
      const existsinThirtyMinsSlot = enablethirtyMinsSlots.some((arrayDate) => arrayDate.getTime() === date.getTime());

      const existsinEnabledInWeek = enabledDays.some((arrayDate) => {
        const slotDateMoment = moment(date);
        const arrayMomentDate = moment(arrayDate);
        return arrayMomentDate.isSame(slotDateMoment, 'day')
      });
      const existInEnableSlots = enablethirtyMinsSlots.some((dateTime) =>
        dateTime.getTime() === date.getTime());

      if (disabledHours && disabledHours.some((timeRange) => {
        const [start, end] = timeRange;
        return formattedTime === start;
      }) && !existsinThirtyMinsSlot && !existsinEnabledInWeek) {
        return {
          className: 'disabled-slot',
          onClick: () => { window.alert('This slot is disabled.'); }
        };
      }
      else if (existsinEnabledInWeek && existInEnableSlots) {
        return {
          className: 'enable-slot',
        }
      }
    }
    return {};
  }, [disabledHours, enablethirtyMinsSlots]);

  return (
    <div className="h-100">
      <Calendar
        localizer={localizer}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
        onSelectSlot={handleDateClick}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        onSelectEvent={handleEventClick}
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