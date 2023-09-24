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
  eventDetails,
  setEventDetails,
  onCreateEvent,
}) {
  // ...

  const handleSave = () => {
    let startDateTime = eventDetails.start;
    let endDateTime = eventDetails.end;
    if (!eventDetails.title) {
      alert("Please fill in the event title.");
      return;
    }

    startDateTime = new Date(selectedDate); // Start of the selected day
    endDateTime = new Date(selectedDate); // End of the selected day
    endDateTime.setHours(23, 59, 59); // Set the end time to 11:59:59 PM
    if (eventDetails.allDay) {
    } else {
      // Check for empty start and end times only if it's not an "All Day" event
      if (!eventDetails.startTime || !eventDetails.endTime) {
        alert("Please fill in both start and end times.");
        return;
      }
      startDateTime.setHours(
        parseInt(eventDetails.startTime.split(":")[0]),
        parseInt(eventDetails.startTime.split(":")[1])
      );
      endDateTime.setHours(
        parseInt(eventDetails.endTime.split(":")[0]),
        parseInt(eventDetails.endTime.split(":")[1])
      );
    }


    // Check if the event falls within the disabled date range
    // let EventDetailsStartTimeStamp = startDateTime.getTime();
    // let EventDetailsEndTimeStamp = endDateTime.getTime();
    // let DisabledDateStartTimeStamp = disabledDateRange.start.getTime();
    // let DisabledDateEndTimeStamp = disabledDateRange.end.getTime();

    // if (
    //   isTimestampWithinRange(
    //     EventDetailsStartTimeStamp,
    //     DisabledDateStartTimeStamp,
    //     DisabledDateEndTimeStamp
    //   ) ||
    //   isTimestampWithinRange(
    //     EventDetailsEndTimeStamp,
    //     DisabledDateStartTimeStamp,
    //     DisabledDateEndTimeStamp
    //   )
    // ) {
    //   alert("This date or time is disabled. Choose another one.");
    //   return;
    // }

    onCreateEvent({
      title: eventDetails.title,
      start: startDateTime,
      end: endDateTime,
    });
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
                value={eventDetails?.title || ""}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, title: e.target.value })
                }
              />
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={eventDetails?.allDay || false}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, allDay: e.target.checked })
                }
              />
              <label className="form-check-label">All Day</label>
            </div>
            {!eventDetails.allDay && ( // Conditionally render time inputs
              <div>
                <div className="form-group">
                  <label>Start Time:</label>
                  
                  <input
                    type="time"
                    className="form-control"
                    value={eventDetails.startTime || ""}
                    onChange={(e) =>
                      setEventDetails({
                        ...eventDetails,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End Time:</label>
                  
                  <input
                    type="time"
                    className="form-control"
                    value={eventDetails.endTime || ""}
                    onChange={(e) =>
                      setEventDetails({
                        ...eventDetails,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
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
