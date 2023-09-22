import React, { useCallback, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import calendar styles
import moment from "moment"; // You may need to install moment as a dependency
import EventModal from "../../commponents/common/EventModal";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Event 1",
    start: new Date(2023, 8, 21), // Replace with your event start date
    end: new Date(2023, 8, 22), // Replace with your event end date
  },
  // Add more events as needed
];

const disabledDates = [
  new Date(2023, 8, 15), // Disable September 15, 2023
  new Date(2023, 8, 20), // Disable September 20, 2023
  // Add more dates to disable as needed
];
const StudentScheduling = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    allDay: true,
    start: null,
    end: null,
  });
  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
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

    // Close the modal and reset the event details
    setIsModalOpen(false);
    setEventDetails({
      title: "",
      allDay: true,
      start: null,
      end: null,
    });
  };
  const disabledDateRange = {
    start: new Date(2023, 8, 15),
    end: new Date(2023, 8, 20),
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
  const handleDateClick = (slotInfo) => {
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

  return (
    <div>
      <h1>Student Scheduling</h1>
      <div style={{ height: "500px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ width: "100%" }}
          selectable
          onSelectSlot={handleDateClick}
          dayPropGetter={dayPropGetter}
        />
        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            selectedDate={selectedDate}
            eventDetails={eventDetails}
            disabledDateRange={disabledDateRange}
            setEventDetails={setEventDetails}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </div>
    </div>
  );
};

export default StudentScheduling;
