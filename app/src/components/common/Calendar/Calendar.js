import React, { useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import EventModal from "../EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsBookings, get_tutor_setup, updateTutorDisableslots } from "../../../axios/tutor";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import CustomEvent from "./Event";
import Loading from '../Loading'
import { postStudentBookings, setBookedSlots, setReservedSlots } from "../../../redux/student_store/studentBookings";
import { isEqualTwoObjectsRoot } from "../../../helperFunctions/generalHelperFunctions";
import CustomAgenda from "./CustomAgenda";
import { useLocation } from 'react-router-dom';

import '../../../styles/common.css';

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}

export const convertToDate = (date) => (date instanceof Date) ? date : new Date(date)

const ShowCalendar = ({
  timeDifference = null,
  setActiveTab = () => { },
  setDisableColor = () => { },
  disableColor = '',
  activeTab,
  disableWeekDays,
  disabledHours,
  setDisabledWeekDays,
  setDisabledHours
}) => {

  const [activeView, setActiveView] = useState(views.MONTH)
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.user);
  const { selectedTutor } = useSelector(state => state.selectedTutor)
  const location = useLocation();

  // Extract student information from the URL
  const isStudentRoute = (location.pathname.split('/'))[1] === 'student';
  const isStudentLoggedIn = user[0].role === 'student' ? true : user[0].role === 'admin' && isStudentRoute ? true : false;
  const [timeZone, setTimeZone] = useState();

  const [enabledDays, setEnabledDays] = useState([]);
  const [disableDates, setDisableDates] = useState([]);
  const { tutor } = useSelector(state => state.tutor)
  const [enableHourSlots, setEnableHourSlots] = useState([]);
  const [disableHourSlots, setDisableHourSlots] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const tutorAcademyId = localStorage.getItem('tutor_user_id')

  //student states
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSlot, setClickedSlot] = useState({})
  const { student } = useSelector(state => state.student)
  const tutorId = selectedTutor.academyId;
  const studentId = student.AcademyId
  const subjectName = selectedTutor.subject;

  let { reservedSlots, bookedSlots } = useSelector(state => state.bookings);

  //apis functions
  const updateTutorDisableRecord = async () => {
    await updateTutorDisableslots(tutorAcademyId, {
      enableHourSlots,
      disableDates,
      disableWeekDays,
      disableHourSlots,
      enabledDays,
      disableHoursRange: disabledHours,
      disableColor: disableColor || null
    })

  }

  const getTimeZonedDisableHoursRange = (initialArray) => {
    if (!isStudentLoggedIn) return initialArray;

    function addHours(timeString, hours) {
      let time = moment("2000-01-01 " + timeString, "YYYY-MM-DD h:mm a");
      time.add(hours, 'hours');
      let formattedTime = time.format("h:mm a");
      return formattedTime;
    }
    function addHoursToSubArray(subArray) {
      let newArray = subArray.slice();
      newArray[0] = addHours(newArray[0], (timeDifference * -1));
      newArray[1] = addHours(newArray[1], (timeDifference * -1));
      return newArray;
    }

    let updatedArray = initialArray.map(addHoursToSubArray);
    return updatedArray
  }

  const getTimeZonedEnableHours = (originalDates, timeZone) => {
    if (!isStudentLoggedIn || !timeZone) return originalDates;
    console.log(originalDates, 'org')
    return originalDates.map(dateString => {
      const date = moment.utc(convertToDate(dateString)).tz(timeZone);
      const dateObjDate = date.toDate()
      console.log(dateObjDate, 'moment', timeZone, convertToDate(dateString) instanceof Date)
      return dateString; // You can customize the format
    });
  }

  const getTutorSetup = async () => {
    const [result] = await get_tutor_setup(isStudentLoggedIn ? selectedTutor.academyId : tutorAcademyId);
    if (Object.keys(result ? result : {}).length) {
      const updatedEnableHours = getTimeZonedEnableHours(JSON.parse(result.enableHourSlots), timeZone)
      setEnableHourSlots(updatedEnableHours);
      setEnabledDays(JSON.parse(result.enabledDays))
      setDisableDates(JSON.parse(result.disableDates));
      setDisableHourSlots(JSON.parse(result.disableHourSlots));
      setDisabledWeekDays(JSON.parse(result.disableWeekDays));

      console.log(updatedEnableHours?.[0], JSON.parse(result.enableHourSlots),
        JSON.parse(result.enabledDays),
        JSON.parse(result.disableDates),
        JSON.parse(result.disableHourSlots),
        JSON.parse(result.disableWeekDays))

      let updatedDisableHoursRange = getTimeZonedDisableHoursRange(JSON.parse(result.disableHoursRange)) //done
      setDisabledHours(updatedDisableHoursRange);
      setDisableColor(result.disableColor)
    }
    setDataFetched(true);
  }

  const fetchBookings = async () => {
    if (isStudentLoggedIn) {
      const response = await fetchStudentsBookings(selectedTutor.academyId);
      if (response.length) {
        const reservedSlots = response.map(data => JSON.parse(data.reservedSlots)).flat()
        const bookedSlots = response.map(data => JSON.parse(data.bookedSlots)).flat()

        dispatch(setReservedSlots(reservedSlots))
        dispatch(setBookedSlots(bookedSlots))
      }
    }
    else {
      const response = await fetchStudentsBookings(tutorAcademyId);
      if (response.length) {
        const reservedSlots = response.map(data => JSON.parse(data.reservedSlots)).flat()
        const bookedSlots = response.map(data => JSON.parse(data.bookedSlots)).flat()

        dispatch(setReservedSlots(reservedSlots))
        dispatch(setBookedSlots(bookedSlots))
      }
    }
  }

  useEffect(() => {
    if (student.GMT && isStudentLoggedIn) {
      const offset = parseInt(student.GMT, 10);
      const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
      setTimeZone(timezone[0] || null);
    }
    else {
      if (tutor.GMT && !isStudentLoggedIn) {
        const offset = parseInt(tutor.GMT, 10);
        const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
        setTimeZone(timezone[0] || null);
      }
    }
  }, [student, tutor])

  useEffect(() => {
    moment.tz.setDefault(timeZone);
  }, [timeZone]);

  useEffect(() => {
    fetchBookings();
    //remove student //changes made
  }, [selectedTutor, user])

  const onRequestClose = () => {
    setSelectedSlots([]);
    setClickedSlot({})
    setIsModalOpen(false)
  }

  useEffect(() => {
    getTutorSetup()
  }, [timeZone])

  useEffect(() => {
    (activeTab === views.MONTH) ? setActiveView(views.MONTH) : setActiveView(views.WEEK)
  }, [activeTab])

  useEffect(() => {
    if (dataFetched && !isStudentLoggedIn) {
      setTimeout(() => {
        toast.success("Saving Blocked out Slots ....")
        updateTutorDisableRecord()
      }, 1000);
    }
  }, [disableDates, disableHourSlots, enableHourSlots, disableWeekDays, dataFetched, disableColor, disabledHours]);

  const convertToGmt = (date) => {
    return date;
  };

  const filterOtherSudentSession = (givenReservedSlots = []) => {
    let updatedReservedSlot = (givenReservedSlots.length ? givenReservedSlots : reservedSlots).filter(slot => slot.studentId === student.AcademyId);
    let updatedBookedSlots = bookedSlots.filter(slot => slot.studentId === student.AcademyId);
    return { reservedSlots: updatedReservedSlot, bookedSlots: updatedBookedSlots };
  }

  const handleBulkEventCreate = (type) => {
    if (reservedSlots?.some(slot => isEqualTwoObjectsRoot(slot, clickedSlot))) {
      let { reservedSlots, bookedSlots } = filterOtherSudentSession()
      dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots: [...bookedSlots, { ...clickedSlot, title: "Booked", type: 'booked' }], reservedSlots: reservedSlots.filter(slot => slot.id !== clickedSlot.id) }));
      return
    }
    if (reservedSlots?.some(slot => {
      return slot.type === 'intro'
        && slot.subject === selectedTutor.subject
        && slot.studentName === student.FirstName
        && (slot.end.getTime() > (new Date()).getTime() ||
          (!slot.rating))
    })) {
      toast.warning("We are sorry, your intro session must be conducted and rated first")
      return;
    }
    if ((selectedSlots.length && selectedSlots[0].type === 'reserved') && reservedSlots.length > 6) {
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
        studentName: student.FirstName,
        studentId: student.AcademyId,
        createdAt: new Date(),
        subject: selectedTutor.subject,
        tutorId: selectedTutor.academyId,
        rate: (type === 'intro' && selectedTutor.introDiscountEnabled) ? `$${(parseInt(selectedTutor.rate.split('$')[1]) / 2)}.00` : selectedTutor.rate
      }
    })

    //handle delete type later todo
    if (type === 'reserved' || type === 'intro') {

      let { reservedSlots, bookedSlots } = filterOtherSudentSession()
      dispatch(postStudentBookings({ studentId: student.AcademyId, tutorId: selectedTutor.academyId, reservedSlots: reservedSlots.concat(updatedSelectedSlots), bookedSlots, subjectName: selectedTutor.subject }));
    }
    else if (type === 'booked') {

      let { reservedSlots, bookedSlots } = filterOtherSudentSession()
      dispatch(postStudentBookings({ studentId: student.AcademyId, tutorId: selectedTutor.academyId, reservedSlots, bookedSlots: bookedSlots.concat(updatedSelectedSlots), subjectName: selectedTutor.subject }));
    }
  }

  const handleRemoveReservedSlot = (reservedSlots) => {
    let { reservedSlots: updatedReservedSlots, bookedSlots } = filterOtherSudentSession(reservedSlots)
    dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots, reservedSlots: updatedReservedSlots }));
  }

  const handleSetReservedSlots = (reservedSlots) => {
    console.log('ende12r')

    let { reservedSlots: updatedReservedSlots, bookedSlots } = filterOtherSudentSession(reservedSlots)
    dispatch(postStudentBookings({ studentId, tutorId, subjectName, bookedSlots, reservedSlots: updatedReservedSlots }));
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
    const isEventAlreadyExist = (reservedSlots.concat(bookedSlots))?.some(event => (
      convertToDate(event.start).getTime() === clickedDate.getTime() || convertToDate(event.end).getTime() === slotInfo.end.getTime()));

    if (!isStudentRoute && !disableColor) { toast.warning("Please select color before disabling slots!"); return }
    if (isEventAlreadyExist && slotInfo.action === "doubleClick") { toast.warning("Event already exist in that slot. Please select another slot to continue!"); return }
    if (clickedUpperSlot && activeView != views.MONTH) return;
    if (clickedDate.getTime() < (new Date()).getTime()) {
      toast.warning(`Cannot ${!isStudentLoggedIn ? 'Disable/Enable ' : "Book/Reserve"} Older Slots`);
      return
    }
    if (slotInfo.action === "doubleClick") {
      if (!isStudentLoggedIn) {
        if (disableWeekDays && disableWeekDays?.includes(dayName)) {
          if (activeView !== views.MONTH) {
            console.log(enableHourSlots, 'value enablehourslot')
            if (!enableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
              setEnableHourSlots([...(enableHourSlots ?? []), slotInfo.start, endTime])
            }
            else {
              const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && convertToDate(date).getTime() !== endTime.getTime());
              setEnableHourSlots(removeEnableHourSlots)
            }
          }
          else {

            if (!enabledDays?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime()))
              setEnabledDays([...enabledDays, slotInfo.start])
            else {
              const removeEnableDate = enabledDays.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setEnabledDays(removeEnableDate)
            }
          }
        }
        else {
          if (activeView === views.MONTH) {
            const existInDisableDates = disableDates?.some(date =>
              convertToDate(date).getTime() === slotInfo.start.getTime());
            const reservedSlotPresentInClickedDate = reservedSlots?.some(slot => moment(slot.start).date() === moment(clickedDate).date())
            if (!existInDisableDates && !reservedSlotPresentInClickedDate)
              setDisableDates([...disableDates, slotInfo.start])
            else {
              const removeDisableDate = disableDates.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime());
              setDisableDates(removeDisableDate)
            }
          }
          else {
            const existInDisabledDate = disableDates?.some((storedDate) => {
              const slotDateMoment = moment(slotInfo.start);
              const storedMomentDate = moment(storedDate);
              return storedMomentDate.isSame(slotDateMoment, 'day')
            });
            console.log(disabledHours, 'value')
            if (disabledHours &&
              disabledHours?.some((timeRange) => {
                const [start, end] = timeRange;
                return formattedTime >= start && formattedTime < end;
              }) || existInDisabledDate) {
              console.log(enableHourSlots, 'value enablehourslot')

              if (!enableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime())) {
                setEnableHourSlots([...(enableHourSlots ?? []), , slotInfo.start, endTime])
              }
              else {
                const reservedSlotsHaveClickedSlot = reservedSlots?.some(slot => slot.start.getTime() === slotInfo.start.getTime())
                if (!reservedSlotsHaveClickedSlot) {
                  const removeEnableHourSlots = enableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime());
                  setEnableHourSlots(removeEnableHourSlots)
                }
              }
              if (disableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() || endTime.getTime() === convertToDate(date).getTime())) {
                const removeDisableHourSlots = disableHourSlots.filter(date => convertToDate(date).getTime() !== slotInfo.start.getTime() && endTime.getTime() !== convertToDate(date).getTime()
                )
                setDisableHourSlots(removeDisableHourSlots)
              }
            }
            else if (!existInDisabledDate) {
              const reservedSlotsHaveClickedSlot = reservedSlots?.some(slot => slot.start.getTime() === moment(slotInfo.start).startOf('hour').valueOf())
              if (!disableHourSlots?.some(date => convertToDate(date).getTime() === slotInfo.start.getTime() || endTime.getTime() === convertToDate(date).getTime())) {
                if (!reservedSlotsHaveClickedSlot) {
                  setDisableHourSlots([...disableHourSlots, slotInfo.start, endTime])
                }
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
          const existsinEnabledInMonth = enabledDays?.some((arrayDate) => convertToDate(arrayDate).getTime() === clickedDate.getTime());
          const existsinEnabledInWeek = enabledDays?.some((arrayDate) => {
            const slotDateMoment = moment(clickedDate);
            const arrayMomentDate = moment(arrayDate);
            return arrayMomentDate.isSame(slotDateMoment, 'day')
          });

          const isDisableDate = disableDates?.some(storeDate => {
            const slotDateMoment = moment(clickedDate);
            const storedMomentDate = moment(storeDate);
            return storedMomentDate.isSame(slotDateMoment, 'day')
          })
          //slots week/days
          const existInDisableHourSlots = disableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime());
          const existInEnableSlots = enableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === clickedDate.getTime())

          //student general
          const existInReservedSlots = reservedSlots?.some(dateTime => convertToDate(dateTime).getTime() === clickedDate.getTime())
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
          else if (disableWeekDays?.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
            alert("This slot is blocked, please select a white slot.");
          }
          else if (existInDisableHourSlots || !existInEnableSlots && disabledHours?.some((timeRange) => {
            const [start, end] = timeRange;
            return formattedTime === start;
          })) {
            alert("This slot is blocked, please select a white slot.");
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

  const handleEventClick = (event) => {
    setClickedSlot(event)
    setIsModalOpen(true);
  };

  const slotPropGetter = useCallback((date) => {
    if (date && moment(date).isSame(moment(date), 'day')) {
      const formattedTime = moment(date).format('h:00 a');
      //student checks
      const existsinReservedSlots = reservedSlots?.some(slot => {
        // if (slot.type === 'intro' && slot.studentName === "Jason")
        //   console.log(slot, moment(slot.start).utcOffset() / 60, moment(date).utcOffset() / 60, convertToDate(slot.start).getTime(), date.getTime());
        return convertToDate(slot.start).getTime() === date.getTime()
      })
      const existInSelectedSlotStart = selectedSlots?.some(slot => slot.start.getTime() === date.getTime())

      const existInSelectedSlotEnd = selectedSlots?.some((slot) => date.getTime() === (moment(slot.end).subtract(30, 'minutes').toDate()).getTime())
      // tutor checks
      const existInEnableSlots = enableHourSlots?.some((dateTime) => {
        const slotUTCTime = moment.utc(date);
        const enabledSlotUTCTime = moment(convertToDate(dateTime));
        if (moment.utc(date).isSame(moment(convertToDate(dateTime))))
          console.log(date, slotUTCTime.format(), dateTime, 'date');
        // return convertToDate(dateTime).getTime() === date.getTime()
        return slotUTCTime.isSame(enabledSlotUTCTime)
      })
      const existInDisableHourSlots = disableHourSlots?.some((dateTime) => convertToDate(dateTime).getTime() === date.getTime());
      const existInDefaultHours = disabledHours?.some(slot => {
        const startTime = moment('9:00 PM', 'h:mm A');
        const endTime = moment('7:00 AM', 'h:mm A');

        const momentTime = moment(formattedTime, 'h:mm A');

        if (endTime.isBefore(startTime)) {
          return slot[0] === formattedTime && momentTime.isBetween(startTime, moment('11:59 PM', 'h:mm A'), undefined, '[]') ||
            momentTime.isBetween(moment('12:00 AM', 'h:mm A'), endTime, undefined, '[]');
        }

        return slot[0] === formattedTime && momentTime.isBetween(startTime, endTime, undefined, '[]');
      })

      //swithes checks
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
          style: {
            backgroundColor: disableColor
          },
          className: 'disable-slot',
        }
      }
      else if (date.getTime() >= (new Date()).getTime() && disabledHours && disabledHours?.some((timeRange) => {
        const [start] = timeRange;
        return formattedTime === start;
      }) && !existInEnableSlots && !existInDisableHourSlots) {
        return {
          style: {
            backgroundColor: existInDefaultHours ? "lightgray" : disableColor
          },
          className: 'disabled-slot',
          onClick: () => { window.alert('This slot is blocked, please select a white slot.'); }
        };
      }
      else if (existInEnableSlots) {
        console.log('true')
        return {
          // style: {
          //   backgroundColor: "orange",
          //   color: "yellow"
          // },
          className: 'enable-slot',
        }
      }

    }
    return {};
  }, [disabledHours, enableHourSlots, disableHourSlots, reservedSlots, selectedSlots]);

  const dayPropGetter = useCallback(
    (date) => {
      const dayName = moment(date).format("dddd");

      const existsinEnabledInMonth = enabledDays?.some((arrayDate) => convertToDate(arrayDate).getTime() === date.getTime());
      const existsinEnabledInWeek = enabledDays?.some((arrayDate) => {
        const slotDateMoment = moment(date);
        const arrayMomentDate = moment(arrayDate);
        return arrayMomentDate.isSame(slotDateMoment, 'day')
      });

      const isDisableDate = disableDates?.some(storeDate => {
        const slotDateMoment = moment(date);
        const storedMomentDate = moment(storeDate);
        return storedMomentDate.isSame(slotDateMoment, 'day')
      })
      if (date.getTime() >= (new Date()).getTime() && disableWeekDays && disableWeekDays?.includes(dayName) && !existsinEnabledInMonth && !existsinEnabledInWeek || isDisableDate) {
        return {
          style: {
            backgroundColor: disableColor
          },
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

  const eventPropGetter = (event) => {
    const secSubject = reservedSlots?.some(slot => slot.type === 'intro'
      && event.subject !== selectedTutor.subject)
    const otherStudentSession = isStudentLoggedIn ? (reservedSlots.concat(bookedSlots))?.some(slot =>
      slot.studentName !== student.FirstName && event.id === slot.id
    ) : false
    if (otherStudentSession && (event.type === "intro" || event.type === "booked")) {
      return {
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: 'purple',
          color: "white"
        },
      };
    }
    if (otherStudentSession && event.type === "reserved") {
      return {
        style: {
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: '#d9caf8',
          color: "black"
        },
      };
    }
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

  const handleViewChange = (view) => setActiveView(view)

  //handle scroll
  useEffect(() => {
    setActiveTab(activeView === 'week' ? 'day' : activeView)
    const weekTab = document.querySelector('.rbc-time-content');
    if (weekTab) {
      const middle = weekTab.scrollHeight / 3.5;
      weekTab.scrollTop = middle;
    }
  }, [activeView, isStudentRoute]);

  useEffect(() => {
    if (isStudentRoute) setActiveView('week')
  }, [location])

  const localizer = momentLocalizer(moment);
  if (!dataFetched)
    return <Loading height="60vh" />
  return (
    <div style={{ height: "100%" }}>
      <Calendar
        views={["day", "week", "month"]}
        localizer={localizer}
        selectable={true}
        defaultView={activeView}
        events={reservedSlots.concat(bookedSlots).map((event) => ({
          ...event,
          start: convertToGmt(event.start),
          end: convertToGmt(event.end),
        }))}
        eventPropGetter={eventPropGetter}
        components={{
          event: event => (
            <CustomEvent
              {...event}
              handleSetReservedSlots={handleSetReservedSlots}
              reservedSlots={reservedSlots}
              handleEventClick={handleEventClick}
              isStudentLoggedIn={isStudentLoggedIn}
            />
          ),
          agenda: {
            agenda: CustomAgenda,
          },
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
        student={student}
        isStudentLoggedIn={isStudentLoggedIn}
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