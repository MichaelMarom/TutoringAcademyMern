import React, { useCallback, useEffect, useState } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "../EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { get_tutor_setup } from "../../../axios/tutor";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import CustomEvent from "./Event";
import { getStudentBookings, postStudentBookings } from "../../../redux/student_store/studentBookings";
import { formatName, isEqualTwoObjectsRoot } from "../../../helperFunctions/generalHelperFunctions";
moment.locale("en-GB");

const localizer = momentLocalizer(moment);

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}

export const convertToDate = (date) => (date instanceof Date) ? date : new Date(date)

const ShowCalendar = ({ activeTab, disableWeekDays, disabledHours, setDisabledWeekDays, setDisabledHours }) => {

  const [activeView, setActiveView] = useState(views.MONTH)
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);
  const { selectedTutor } = useSelector(state => state.selectedTutor)

  const isStudentLoggedIn = user.parentEmail ? true : false

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);

  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  //student states
  const [selectedSlots, setSelectedSlots] = useState([]);
  // const [reservedSlots, setReservedSlots] = useState([]);
  // const [bookedSlots, setBookedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSlot, setClickedSlot] = useState({})
  const tutorId = selectedTutor.academyId;
  const studentId = user.academyId;
  const subjectName = selectedTutor.subject;

  const { reservedSlots, bookedSlots } = useSelector(state => state.bookings);

  // useEffect(() => {
  //   setReservedSlots(stateReservedSlots);
  //   setBookedSlots(stateBookedSlots)
  // }, [stateReservedSlots, stateBookedSlots])

  const onRequestClose = () => {
    setSelectedSlots([]);
    setClickedSlot({})
    setIsModalOpen(false)
  }

  const updateTutorDisableRecord = async () => {
    await axios.put(`${process.env.REACT_APP_BASE_URL}/tutor/update/${selectedTutor.id}`, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours
    });
  }
  const getTutorSetup = async () => {
    const [result] = await get_tutor_setup(selectedTutor.academyId);
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
    if (dataFetched && !isStudentLoggedIn)
      updateTutorDisableRecord();
  }, [disableDates, disableHourSlots, enableHourSlots, disableWeekDays, dataFetched]);

  useEffect(() => {
    dispatch(getStudentBookings(user.academyId, selectedTutor.academyId));
  }, [selectedTutor])

  const handleBulkEventCreate = (type) => {
    if (reservedSlots.some(slot => isEqualTwoObjectsRoot(slot, clickedSlot))) {
      dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots: [...bookedSlots, { ...clickedSlot, title: "Booked", type: 'booked' }], reservedSlots: reservedSlots.filter(slot => slot.id !== clickedSlot.id) }));
      return
    }
    if (reservedSlots.some(slot => slot.type === 'intro'
      && slot.subject === selectedTutor.subject
      && slot.end.getTime() > (new Date()).getTime())) {
      toast.warning("We are sorry, your intro session must be conducted first")
      return;
    }
    if ((selectedSlots.length && selectedSlots[0].type === 'reserved') + reservedSlots.length > 6) {
      toast.warning("Cannot Reserve more than 6 slots")
      return;
    }
    const updatedSelectedSlots = selectedSlots.map((slot) => {
      return {
        ...slot,
        type,
        id: uuidv4(),
        title: type == 'reserved' ? 'Reserved' :
          type === 'intro' ? 'Intro' : "Booked",
        studentName: user.firstName,
        createdAt: new Date(),
        subject: selectedTutor.subject
      }
    })

    //handle delete type later todo
    if (type === 'reserved' || type === 'intro') {
      dispatch(postStudentBookings({ studentId: user.academyId, tutorId: selectedTutor.academyId, reservedSlots: reservedSlots.concat(updatedSelectedSlots), bookedSlots, subjectName: selectedTutor.subject }));
    }
    else if (type === 'booked') {
      dispatch(postStudentBookings({ studentId: user.academyId, tutorId: selectedTutor.academyId, reservedSlots, bookedSlots: bookedSlots.concat(updatedSelectedSlots), subjectName: selectedTutor.subject }));
    }
  }

  const handleRemoveReservedSlot = (reservedSlots) => {
    dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots, reservedSlots }));
  }

  const handleSetReservedSlots = (reservedSlots) => {
    dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots, reservedSlots }));
  }

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
      toast.warning(`Cannot ${!isStudentLoggedIn ? 'Disable/Enable ' : "Book/Reserve"} Older Slots`);
      return
    }
    if (slotInfo.action === "doubleClick") {
      if (!isStudentLoggedIn) {
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
      } else if (isStudentLoggedIn) {
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
              // const removeReservedSlots = reservedSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
              // )
              // setReservedSlots(removeReservedSlots)
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
              // const removeReservedSlots = reservedSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
              // )
              // setReservedSlots(removeReservedSlots)
            }
            else {
              if (selectedSlots.length < 6) {
                setSelectedSlots([...selectedSlots, { start: startEventTime.toDate(), end: endEventTime.toDate(), subject: selectedTutor.subject }])
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
      if (isStudentLoggedIn) {
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
    setClickedSlot(event)
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (isModalOpen) {

      // if (event.type !== 'booked') {
      console.log('enter');
      const message = `Are you ready to pay for the lesson with tutor ${formatName(selectedTutor.firstName, selectedTutor.lastName)} ?`;
      // const result = window.confirm(message);
      //handle intro payment later todo
      // if (result && event.type !== 'intro') {
      // dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots: [...bookedSlots, { ...event, title: "Booked", type: 'booked' }], reservedSlots: reservedSlots.filter(slot => slot.id !== event.id) }));
      // }

      // }
    }
  }, [isModalOpen])

  const slotPropGetter = useCallback((date) => {
    if (date && moment(date).isSame(moment(date), 'day')) {
      const formattedTime = moment(date).format('h:00 a');
      //student checks
      const existsinReservedSlots = reservedSlots.some(slot => convertToDate(slot.start).getTime() === date.getTime())
      const existInSelectedSlotStart = selectedSlots.some(slot => slot.start.getTime() === date.getTime())

      const existInSelectedSlotEnd = selectedSlots.some((slot) => date.getTime() === (moment(slot.end).subtract(30, 'minutes').toDate()).getTime())
      // tutor checks
      const existInEnableSlots = enableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime())

      const existInDisableHourSlots = disableHourSlots.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime());

      if (existsinReservedSlots) {
        return {
          className: 'reserved-slot'
        }
      }
      else if (existInSelectedSlotStart) {
        return {
          className: 'place-holder-start-slot',
        };
      }
      else if (existInSelectedSlotEnd) {
        return {
          className: "place-holder-end-slot"
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

  const handleViewChange = (view) => setActiveView(view)


  const eventPropGetter = (event) => {
    const secSubject = reservedSlots.some(slot => slot.type === 'intro'
      && event.subject !== selectedTutor.subject)

    if (secSubject && event.type === 'intro') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightblue',
          color: "black"
        },
      };
    }
    if (secSubject && event.type === 'reserved') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightYellow',
          color: "black"
        },
      };
    }
    else if (secSubject && event.type === 'booked') {
      return {
        className: 'sec-reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'lightGreen',
          color: "black"
        },
      };
    }
    else if (event.type === 'reserved') {
      return {
        className: 'reserved-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'yellow',
          color: "black"
        },
      };
    } else if (event.type === 'booked') {
      return {
        className: 'booked-event',
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
              setReservedSlots={handleSetReservedSlots}
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
            />
          ),
        }}
        view={activeView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
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
        clickedSlot={clickedSlot}
        setClickedSlot={setClickedSlot}
        handleRemoveReservedSlot={handleRemoveReservedSlot}
      />
    </div>
  );
};
export default ShowCalendar;