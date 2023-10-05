import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import LeftSideBar from "../LeftSideBar";

const customStyles = {
  content: {
    zIndex: "111",
    height: "fit-content",
    width: "20rem",
    left: 0,
    top: "5rem"
  },
};

function EventModal({
  isOpen,
  onRequestClose,
  selectedSlots,
  handleCreateEvent,
  reservedSlots,
  bookedSlots
}) {
  const [selectedType, setSelectedType] = useState("booked");

  const ifEventAlreadyExist = () => {
    const events = reservedSlots.concat(bookedSlots);
    return events.some(event => event.start.getTime() === selectedSlots.start.getTime() || event.end.getTime() === selectedSlots.start.getTime());
  }

  const hasIntroEvent = () => {
    const events = reservedSlots.concat(bookedSlots);
    return events.some(event => event.type === 'intro');
  }

  useEffect(() => {
    if (!hasIntroEvent() && selectedType !== 'intro' && selectedSlots.start) {
      alert('Can not reserve or book lesson before the introduction')
    }
  }, [reservedSlots, selectedType])

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
            {/* <SlotPill /> */}
          </div>

          <div className="form-group d-flex flex-column">
            <button type="button" className={`btn btn-primary btn-sm `} onClick={() => setSelectedType("intro")} disabled={ifEventAlreadyExist()}>Introduction</button>
            <button type="button" className="btn btn-success btn-sm" disabled={ifEventAlreadyExist()} onClick={() => setSelectedType("booked")}>Booked</button>
            <button type="button" className="btn  btn-sm" style={{ background: "yellow" }} disabled={ifEventAlreadyExist()} onClick={() => setSelectedType("reserved")}>Reserved</button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setSelectedType("delete")}>Delete</button>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              handleCreateEvent({
                ...selectedSlots,
                type: selectedType,
                id: uuidv4(),
                createdAt: new Date(),
              });
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
