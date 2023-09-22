import React from "react";
import Modal from "react-modal";

// Initialize the modal root element (put it in your index.js or App.js)
Modal.setAppElement("#root");

const customStyles = {
  content: {
    zIndex: "111",
    height: "fit-content",
  },
};
function isTimestampWithinRange(x, min, max) {
  return x >= min && x <= max;
}
function EventModal({
  isOpen,
  onRequestClose,
  selectedDate,
  disabledDateRange,
  eventDetails,
  setEventDetails,
  onCreateEvent,
}) {
  // ...

  const handleSave = () => {
    if (!eventDetails.title || !eventDetails.start || !eventDetails.end) {
      alert("Please fill in all fields");
      return;
    }
    let EventDetailsStartTimeStamp = eventDetails.start.getTime();
    let EventDetailsEndTimeStamp = eventDetails.end.getTime();
    let DisabledDateStartTimeStamp = disabledDateRange.start.getTime();
    let DisabledDateEndTimeStamp = disabledDateRange.end.getTime();
    if(isTimestampWithinRange(EventDetailsStartTimeStamp,DisabledDateStartTimeStamp,DisabledDateEndTimeStamp) || isTimestampWithinRange(EventDetailsEndTimeStamp,DisabledDateStartTimeStamp,DisabledDateEndTimeStamp)) {
      alert("this is disabled date range. choose another one");
      return;
    }
    onCreateEvent();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Date Modal"
      style={customStyles}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Event on {selectedDate}</h5>
          <button type="button" className="close" onClick={onRequestClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                className="form-control"
                value={eventDetails.title}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, title: e.target.value })
                }
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={eventDetails.allDay}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, allDay: e.target.checked })
                }
              />
              <label className="form-check-label">All Day</label>
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="date"
                className="form-control"
                value={
                  eventDetails.start
                    ? eventDetails.start.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    start: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input
                type="date"
                className="form-control"
                value={
                  eventDetails.end
                    ? eventDetails.end.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEventDetails({
                    ...eventDetails,
                    end: new Date(e.target.value),
                  })
                }
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EventModal;
