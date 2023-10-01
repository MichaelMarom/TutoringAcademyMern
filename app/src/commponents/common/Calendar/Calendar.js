import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch } from "react-redux";
import { addEvent, storeEvent } from "../../../redux/tutor_store/EventSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { get_tutor_setup } from "../../../axios/tutor";
moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timeZone);

const ShowCalendar = ({ disableWeekDays, disabledHours, setDisabledWeekDays, setDisabledHours }) => {
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

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);

  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const updateTutorDisableRecord = async () => {
    await axios.put(`${process.env.REACT_APP_BASE_URL}/tutor/update/2`, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours
    });
  }
  const getTutorSetup = async () => {
    const [result] = await get_tutor_setup('Kolin. P. C1501fa');
    console.log(result.enableHourSlots, result.enabledDays, result.disableDates, result.disableHourSlots, result.disableWeekDays, result.disableHoursRange, 'set to true')

    setEnableHourSlots(JSON.parse(result.enableHourSlots));
    setEnabledDays(JSON.parse(result.enabledDays))
    setDisableDates(JSON.parse(result.disableDates));
    setDisableHourSlots(JSON.parse(result.disableHourSlots));
    setDisabledWeekDays(JSON.parse(result.disableWeekDays));
    setDisabledHours(JSON.parse(result.disableHoursRange));
    setDataFetched(true);

  }

  useEffect(() => {
    getTutorSetup()
  }, [])

  useEffect(() => {
    if (dataFetched)
      updateTutorDisableRecord();
  }, [disableDates, disableHourSlots, enableHourSlots, disableWeekDays, dataFetched]);

  let formats = {
    timeGutterFormat: 'HH:mm',
  }
  const convertToDate = (date) => (date instanceof Date) ? date : new Date(date)

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    const secSlot = moment(slotInfo.start).minutes() === 30;
    let endTime = secSlot ? moment(slotInfo.start).subtract(30, 'minutes').toDate() : slotInfo.end;

    let clickedUpperSlot = moment(slotInfo.end).diff(moment(slotInfo.start), 'days') === 1;
    if (clickedUpperSlot && activeView != views.MONTH) return;
    if (slotInfo.action === "doubleClick") {
      if (user === "tutor") {
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
      } else if (user === "student") {
      }
      return;
    } else if (slotInfo.action === "click") {
      if (user === "student") {
        if (disableWeekDays && disableWeekDays.includes(dayName)) {
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
      if (disableWeekDays && disableWeekDays.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
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

      const existInEnableSlots = enableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime())

      const existInDisableHourSlots = disableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime())
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

  if (!dataFetched)
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border" role="status">
        </div>
      </div>
    )
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