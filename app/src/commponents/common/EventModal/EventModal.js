import React, { useEffect, useState } from "react";
import LeftSideBar from "../LeftSideBar";
import SlotPill from "../../student/SlotPill";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SlotsInvoice from "../../student/SlotsInvoice";
import { formatName, isEqualTwoObjectsRoot } from "../../../helperFunctions/generalHelperFunctions";


function EventModal({
  isOpen,
  onRequestClose,
  selectedSlots,
  setSelectedSlots,
  handleBulkEventCreate,
  reservedSlots,
  clickedSlot,
  handleRemoveReservedSlot,
  setClickedSlot
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [canPostEvents, setCanPostEvents] = useState(true)

  const { selectedTutor } = useSelector(state => state.selectedTutor)
  const { user } = useSelector(state => state.user)

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
    const existIntroSession = reservedSlots.some(slot => slot.type === 'intro' && selectedTutor.subject === slot.subject)
    if (existIntroSession && selectedType === 'intro' && selectedSlots[0]?.start) {
      toast.warning('Cannot add more than 1 Intro Session!')
      setCanPostEvents(false)
    }
    else if ((!existIntroSession && selectedType !== 'intro') && selectedSlots[0]?.start) {
      setCanPostEvents(false)
      toast.warning('Can not reserve or book lesson before the intro Session')
    } else if (existIntroSession && selectedType === 'intro' && selectedSlots.length > 1) {
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
          <h4 className="modal-title" style={{ width: '80%' }}>Selected Slots</h4>

        </div>
        <div className="">
          {clickedSlot.start ?
            <div>
              <SlotPill selectedSlots={[clickedSlot]} handleRemoveSlot={() => setClickedSlot({})} selectedType={selectedType} />
            </div> :
            <div>
              <SlotPill selectedSlots={selectedSlots} handleRemoveSlot={handleRemoveSlot} selectedType={selectedType} />
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
              studentName={formatName(user.firstName, user.lastName)}
              tutorName={formatName(selectedTutor.firstName, selectedTutor.lastName)}
              invoiceNumber={123}
              selectedSlots={clickedSlot.start ? [clickedSlot] : selectedSlots}
              subject={selectedTutor.subject}
              rate={selectedTutor.rate}
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
