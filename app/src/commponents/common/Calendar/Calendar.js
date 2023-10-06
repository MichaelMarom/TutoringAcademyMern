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
import { v4 as uuidv4 } from 'uuid';
import CustomEvent from "./Event";
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
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onRequestClose = () => {
    setSelectedSlots([]);
    setIsModalOpen(false)
  }

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

  const handleBulkEventCreate = (type) => {
    console.log(selectedSlots)
    const updatedSelectedSlots = selectedSlots.map((slot) => {
      return {
        ...slot,
        type,
        id: uuidv4(),
        title: type == 'reserved' ? 'Reserved' :
          type === 'intro' ? 'Intro' : "Booked",
        studentName: "JHON",
        createdAt: new Date(),
      }
    })
    console.log(updatedSelectedSlots)
    if (type === 'reserved')
      setReservedSlots(reservedSlots.concat(updatedSelectedSlots))
    else if (type === 'booked')
      setBookedSlots(bookedSlots.concat(updatedSelectedSlots))
  }
  useEffect(() => {
    console.log(reservedSlots)
  }, [reservedSlots])
  const handleCreateEvent = (newEventDetails) => {
    console.log(1)
    if (newEventDetails.type == 'delete') {
      const removeReservedSlots = reservedSlots.filter(date => convertToDate(date.start).getTime() !== newEventDetails.start.getTime())
      setReservedSlots(removeReservedSlots)
      return;
    }
    const newEvent = {
      id: newEventDetails.id,
      title: newEventDetails.type == 'reserved' ? 'Reserved' :
        newEventDetails.type === 'intro' ? 'Intro' : "Booked",
      start: newEventDetails.start,
      end: newEventDetails.end,
      studentName: newEventDetails.name,
      createdAt: newEventDetails.createdAt,
      type: newEventDetails.type,
    };
    if (newEventDetails.type === 'booked') {
      setBookedSlots([...bookedSlots, newEvent])
      return;
    }
    setReservedSlots([...reservedSlots, newEvent]);
  };

  const handleDateClick = (slotInfo) => {
    const clickedDate = slotInfo.start;
    const dayName = moment(clickedDate).format("dddd");
    const formattedTime = moment(clickedDate).format("h:00 a");

    const secSlot = moment(slotInfo.start).minutes() === 30;
    let endTime = secSlot ? moment(slotInfo.start).subtract(30, 'minutes').toDate() : slotInfo.end;
    //student
    const momentStartTime = moment(clickedDate);
    let startEventTime = momentStartTime.minute(0);
    let endEventTime = momentStartTime.clone().minute(0).add(1, 'hour')


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
            else {
              // handleCreateEvent({ id: uuidv4(), type: "reserved", start: startEventTime.toDate(), end: endEventTime.toDate(), name: "asiya", createdAt: moment().subtract(1, "minutes").toDate() })
            }
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
            else {
              if (selectedSlots.length < 6) {
                setSelectedSlots([...selectedSlots, { start: startEventTime.toDate(), end: endEventTime.toDate(), name: "Jhony" }])
                setIsModalOpen(true);
              }
              else {
                toast.error('You can not Place Hold more than 6 Slots! ')
              }
              // handleCreateEvent({ id: uuidv4(), type: "reserved", start: startEventTime.toDate(), end: endEventTime.toDate(), name: "Jhony", createdAt: new Date() })
            }
          }
        }
      }

      return;
    } else if (slotInfo.action === "click") {
      if (user.role === "student") {
      }
    }
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
    const message = `Are you ready to pay for the lesson with tutor ${currentTutor.name} ?`;
    const result = window.confirm(message);
    if (result) {
      setReservedSlots(reservedSlots.filter(slot => slot.id !== event.id))
      setBookedSlots([...bookedSlots, { ...event, title: "Booked", type: 'booked' }])
    }

  };
  const slotPropGetter = useCallback((date) => {
    if (date && moment(date).isSame(moment(date), 'day')) {
      const formattedTime = moment(date).format('h:00 a');
      //student checks
      const existsinReservedSlots = reservedSlots.some(slot => convertToDate(slot).getTime() === date.getTime())
      const existInSelectedSlotStart = selectedSlots.some(slot => slot.start.getTime() === date.getTime())

      const existInSelectedSlotEnd = selectedSlots.some((slot) => date.getTime() === (moment(slot.end).subtract(30, 'minutes').toDate()).getTime())
      //tutor checks
      const existInEnableSlots = enableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime())

      const existInDisableHourSlots = disableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime());

      if (existsinReservedSlots) {
        return {
          className: 'reserved-slot'
        }
      }
      else if (existInSelectedSlotStart) {
        return {
          style: {
            border: '1px solid red',
            borderBottom: '0',
          },
          className: 'place-holder', // Add the CSS class here
        };
      }
      else if (existInSelectedSlotEnd) {
        return {
          style: {
            border: '1px solid red',
            borderTop: '0',
          }
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
  }, [disabledHours, enableHourSlots, disableHourSlots, reservedSlots, selectedSlots]);

  const handleViewChange = (view) => {
    setActiveView(view)
  }

  const eventPropGetter = (event) => {
    if (event.type === 'reserved') {
      return {
        className: 'reserved-event',
        style: {
          backgroundColor: 'yellow',
          color: "black"
        },
      };
    } else if (event.type === 'booked') {
      return {
        className: 'booked-event',
        style: {
          backgroundColor: 'green',
        },
      };
    }
    return {};
  };

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
        events={reservedSlots.concat(bookedSlots)}
        eventPropGetter={eventPropGetter}
        components={{
          event: event => (
            <CustomEvent
              {...event}
              setReservedSlots={setReservedSlots}
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
            />
          ),
        }}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "60vh", width: "100%" }}
        step={30}
        onSelectSlot={handleDateClick}
        dayPropGetter={dayPropGetter}
        slotPropGetter={slotPropGetter}
        onView={handleViewChange}
      />
      <EventModal
        isOpen={isModalOpen}
        selectedSlots={selectedSlots}
        setSelectedSlots={setSelectedSlots}
        onRequestClose={onRequestClose}
        handleBulkEventCreate={handleBulkEventCreate}
        reservedSlots={reservedSlots}
        bookedSlots={bookedSlots}
      />
    </div>
  );
};
export default ShowCalendar;