import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import LeftSideBar from "../LeftSideBar";
import SlotPill from "../../student/SlotPill";
import { toast } from "react-toastify";


function EventModal({
  isOpen,
  onRequestClose,
  selectedSlots,
  setSelectedSlots,
  handleBulkEventCreate,
  reservedSlots,
  bookedSlots
}) {
  const [selectedType, setSelectedType] = useState("booked");

  // const ifEventAlreadyExist = () => {
  //   const events = reservedSlots.concat(bookedSlots);
  //   console.log(events, 'events')
  //   return events.some(event => event.start.getTime() === selectedSlots.start.getTime() || event.end.getTime() === selectedSlots.start.getTime());
  // }
  console.log(selectedSlots,',;secldede')
  const hasIntroEvent = () => {
    const events = reservedSlots.concat(bookedSlots);
    return events.some(event => event.type === 'intro');
  }

  const handleRemoveSlot = (startTime) => {
    setSelectedSlots(selectedSlots.filter((slot) => slot.start.getTime() !== startTime.getTime()))
  }

  // useEffect(() => {
  //   if (!hasIntroEvent() && selectedType !== 'intro' && selectedSlots.start) {
  //     alert('Can not reserve or book lesson before the introduction')
  //   }
  // }, [reservedSlots, selectedType])


  useEffect(() => {
    if (selectedType === 'intro' && selectedSlots > 1) {
      toast.warning('Cannot book more than 1 Intro session!')
    }
    else {
      // addTypeAndIdinSelectedSlots()
    }
  }, [selectedType, selectedSlots])


  return (
    <LeftSideBar
      isOpen={isOpen}
      onClose={onRequestClose}
    >
      <div className="">
        <div className="modal-header">
          <h4 className="modal-title" style={{ width: '80%' }}>Selected Slots</h4>

        </div>
        <div className="">

          <div>
            <SlotPill selectedSlots={selectedSlots} handleRemoveSlot={handleRemoveSlot} selectedType={selectedType} />
          </div>

          <div className="form-group d-flex flex-column">
            <button type="button" className={`btn btn-primary btn-sm `} onClick={() => setSelectedType("intro")} >Mark as Intro Session</button>
            <button type="button" className="btn btn-success btn-sm" onClick={() => setSelectedType("booked")}>Mark as Booking Session</button>
            <button type="button" className="btn  btn-sm" style={{ background: "yellow" }} onClick={() => setSelectedType("reserved")}>Mark as Reserved Session</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setSelectedType("delete")}>Delete</button>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              handleBulkEventCreate(selectedType)
              onRequestClose()
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </LeftSideBar>
  );
}

export default EventModal;
