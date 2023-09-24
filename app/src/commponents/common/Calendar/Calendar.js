import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch } from "react-redux";
import { addEvent, storeEvent } from "../../../redux/tutor_store/EventSlice";
const localizer = momentLocalizer(moment);
const ShowCalendar = ({ disabledDays,disabledHours }) => {
  const [events, setEvents] = useState([]);
  const dispatch=useDispatch();

  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format('h:00 a');

    if (disabledDays && disabledDays.includes(dayName)) {
      // Date falls on a selected day, show an alert
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
      // Slot falls within a disabled time range, show an alert
      alert("This slot is disabled.");
      return;
    }
    setIsModalOpen(true);
    setSelectedDate(slotInfo.start.toString());
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
      // Check if the date falls within the disabled date range

      if (disabledDays && disabledDays.includes(dayName)) {
        // Date falls on a selected day, apply disabled style
        return {
          className: "disabled-date",
          onClick: (e) => {
            e.preventDefault(); // Prevent interaction with disabled dates
          },
        };
      }
      // Default styling for other dates
      return {};
    },
    [disabledDays]
  );
  const slotPropGetter =useCallback((date) => {
    console.log(disabledHours);
    if (date && moment(date).isSame(moment(date), 'day')) {

      const formattedTime = moment(date).format('h:00 a');
      if (disabledHours && disabledHours.some((timeRange) => {
        const [start, end] = timeRange;
        return formattedTime >= start && formattedTime < end;
      })) {
        return {
          className: 'disabled-slot', // Add a CSS class to style the disabled slot
          onClick: () => { window.alert('This slot is disabled.'); } // Prevent clicking on the disabled slot
        };
      }
    }
    return {};
  },[disabledHours]);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };
  useEffect(() => {
    console.log("Events updated:", events);
  }, [events]);
  return (
    <div className="h-100">
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
        onSelectSlot={handleDateClick}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
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
  );
};
export default ShowCalendar;