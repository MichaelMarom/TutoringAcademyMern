import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
const localizer = momentLocalizer(moment);
const ShowCalendar = ({ disabledDays }) => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const disabledDateRange = {
    start: new Date(2023, 8, 15),
    end: new Date(2023, 8, 20),
  };
  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    if (
      slotInfo.start.getTime() >= disabledDateRange.start.getTime() &&
      slotInfo.end.getTime() <= disabledDateRange.end.getTime()
    ) {
      // This range is disabled, so you can prevent the selection
      alert("This date range is disabled.");
      return;
    }
    if (disabledDays && disabledDays.includes(dayName)) {
      // Date falls on a selected day, show an alert
      alert("This day is disabled.");
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
    setEvents([...events, newEvent]);
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
    [disabledDateRange, disabledDays]
  );
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
      />
      <EventModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        selectedDate={selectedDate}
        eventDetails={eventDetails}
        disabledDateRange={disabledDateRange}
        setEventDetails={setEventDetails}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};
export default ShowCalendar;