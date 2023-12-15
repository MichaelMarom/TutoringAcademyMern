import React, { useEffect, useState } from "react";
import LeftSideBar from "../LeftSideBar";
import SlotPill from "../../student/SlotPill";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SlotsInvoice from "../../student/SlotsInvoice";
import { convertTutorIdToName, formatName, isEqualTwoObjectsRoot } from "../../../helperFunctions/generalHelperFunctions";
import { convertToDate } from "../Calendar/Calendar";
import Button from "../Button";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone'

function EventModal({
  isStudentLoggedIn = false,
  student = {},
  isOpen,
  onRequestClose,
  selectedSlots,
  setSelectedSlots,
  handleBulkEventCreate,
  reservedSlots,
  bookedSlots,
  clickedSlot,
  handleRemoveReservedSlot,
  setClickedSlot,
  timeZone,
  handleRescheduleSession
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [canPostEvents, setCanPostEvents] = useState(true)
  const sessionInFuture = convertToDate(clickedSlot.end).getTime() > (new Date()).getTime()
  const { selectedTutor } = useSelector(state => state.selectedTutor);
  const [rescheduleTime, setRescheduleTime] = useState(timeZone ? (moment().add(1, 'hours').set({ minute: 0 }).tz(timeZone)).toDate() : moment().toDate())

  const formatUTC = (dateInt, addOffset = false) => {
    let date = (!dateInt || dateInt.length < 1) ? new Date : new Date(dateInt);
    const currentDate = new Date();
    if (date < currentDate) {
      return null; // You can also throw an error here if you prefer
    }
    if (typeof dateInt === "string") {
      return date;
    } else {
      const offset = addOffset ? date.getTimezoneOffset() : -(date.getTimezoneOffset());
      const offsetDate = new Date();
      offsetDate.setTime(date.getTime() + offset * 60000)
      return offsetDate;
    }
  }

  const handleReschedule = () => {
    if (convertToDate(clickedSlot.start).getTime() === convertToDate(rescheduleTime).getTime()) { toast.warning('Session is already on same time!'); return }
    const sessionExistOnSelectedTime = reservedSlots.filter((slot) =>
      moment.utc(convertToDate(slot.start)).isSame(moment.utc(convertToDate(rescheduleTime))));
    if (sessionExistOnSelectedTime.length) { toast.warning('Session is already exist on that time!'); return }
    const rescheduleEndTime = moment(convertToDate(rescheduleTime)).add(1, 'hours');
    const updatedReservedSlot = (reservedSlots.concat(bookedSlots)).map((slot) => slot.id === clickedSlot.id ?
      { ...slot, request: null, start: rescheduleTime, end: rescheduleEndTime.toDate() } : slot)
    handleRescheduleSession(updatedReservedSlot.filter(slot => slot.type === 'intro' || slot.type === 'reserved'),
     [])
    onRequestClose()
    setSelectedType(null)
  }

  const handleRemoveSlot = (startTime) => {
    setSelectedSlots(selectedSlots.filter((slot) => slot.start.getTime() !== startTime.getTime()))
  }

  const handleAccept = () => {
    if (canPostEvents) {
      handleBulkEventCreate(selectedType);
      onRequestClose();
      setSelectedType(null)
    }
  }

  useEffect(() => {
    const existIntroSession = reservedSlots?.some(slot => slot.type === 'intro' && selectedTutor.subject === slot.subject && (!isStudentLoggedIn || slot.studentId === student.AcademyId))
    if (existIntroSession && selectedType === 'intro' && selectedSlots[0]?.start) {
      toast.warning('Cannot add more than 1 Intro Session!')
      setCanPostEvents(false)
    }
    else if ((!existIntroSession && selectedType !== 'intro') && selectedSlots[0]?.start) {
      setCanPostEvents(false)
      toast.warning(`Your first Session must be Introduction session for ${selectedTutor.subject}!`)
    }
    else if (existIntroSession && selectedType === 'intro' && selectedSlots.length > 1) {
      setCanPostEvents(false)
      toast.warning('Cannot book more than 1 Intro session!')
    }
    else {
      setCanPostEvents(true)
    }
  }, [selectedSlots, selectedType, reservedSlots])

  return (
    <LeftSideBar
      isOpen={isOpen}
      onClose={() => {
        onRequestClose()
        setSelectedType(null)
      }}
    >
      <div className="">
        <div className="modal-header">
          <h4 className="modal-title text-center" style={{ width: '100%' }}>Selected Slots</h4>
        </div>
        <div className="">
          {clickedSlot.request === 'postpone' &&
            <h5 className="text-danger font-weight-bold text-center m-2">{convertTutorIdToName(clickedSlot.tutorId)} is requesting Reschedule</h5>
          }
          {clickedSlot.start ?
            <div>
              <SlotPill selectedSlots={[clickedSlot]} handleRemoveSlot={() => setClickedSlot({})} selectedType={selectedType} />
            </div> :
            <div>
              <SlotPill
                selectedSlots={selectedSlots}
                handleRemoveSlot={handleRemoveSlot}
                selectedType={selectedType} />
            </div>
          }
          <div className="form-group d-flex flex-column">
            <button type="button" className={`btn btn-primary btn-sm `}
              disabled={clickedSlot.start}
              onClick={() => setSelectedType("intro")} >Mark as Intro Session</button>
            <button type="button" className="btn btn-success btn-sm"
              onClick={() => setSelectedType("booked")}>Mark as Booking Session</button>
            <button type="button" className="btn  btn-sm" style={{ background: "yellow" }}
              disabled={clickedSlot.start}
              onClick={() => setSelectedType("reserved")}>Mark as Reserved Session</button>
            <button type="button" className="btn btn-danger btn-sm"
              onClick={() => setSelectedType("delete")}>Delete</button>
            {clickedSlot.request == 'postpone' &&
              <div className='d-flex justify-content-between align-items-center h-100'>
                <DatePicker
                  selected={formatUTC(rescheduleTime, true)}
                  onChange={date => setRescheduleTime(formatUTC(date))}
                  showTimeSelect
                  dateFormat="MMM d, yyyy hh:mm aa"
                  className="form-control m-2 w-80"
                  timeIntervals={60}

                />
                <Button className='btn-success btn-sm' onClick={() => handleReschedule()}>Postpone</Button>
              </div>
            }

          </div>
        </div>

        {
          selectedType == 'delete' &&
          <div className=" p-4">
            <hr />
            <p className="text-danger">Are you sure you want to delete your reservation?!</p>
            <hr />
            <div>

              <button
                type="button"
                className="btn btn-danger btn-sm float-end"
                onClick={() => {
                  handleRemoveReservedSlot(reservedSlots.filter(slot => !isEqualTwoObjectsRoot(slot, clickedSlot)));
                  setClickedSlot({})
                  onRequestClose();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        }
        {
          (selectedType === 'reserved') &&
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAccept}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onRequestClose()
                setSelectedType(null)
              }}
            >
              Cancel
            </button>
          </div>}
        {
          (selectedType === 'intro' || selectedType === 'booked') &&
          <div>
            <SlotsInvoice
              timeZone={timeZone}
              selectedType={selectedType}
              studentName={formatName(student.FirstName, student.LastName)}
              tutorName={formatName(selectedTutor.firstName, selectedTutor.lastName)}
              invoiceNumber={123}
              selectedSlots={clickedSlot.start ? [clickedSlot] : selectedSlots}
              subject={selectedTutor.subject}
              rate={selectedTutor.rate}
              introDiscountEnabled={selectedTutor.introDiscountEnabled}
              handleAccept={handleAccept}
              handleClose={onRequestClose}
            />
          </div>
        }
      </div>
    </LeftSideBar >
  );
}

export default EventModal;
