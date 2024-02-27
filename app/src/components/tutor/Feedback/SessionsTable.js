import React, { useEffect, useState } from 'react';
import { wholeDateFormat } from '../../../constants/constants';
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import Comment from './Comment';
import StarRating from '../../common/StarRating';
import { convertToDate } from '../../common/Calendar/Calendar';
import { useSelector } from 'react-redux';
import Tooltip from '../../common/ToolTip';
import TAButton from '../../common/TAButton'

function SessionsTable({
  events,
  setSelectedEvent,
  selectedEvent,
}) {
  const { shortlist } = useSelector(state => state.shortlist)
  const [eventsWithPhoto, setEventsWithPhoto] = useState([])
  const [sortedEvents, setSortedEvents] = useState([])

  useEffect(() => {
    const updatedEvents = events.map(event => {
      const matchingTutor = shortlist.find(tutor => {
        return (tutor.AcademyId[0] === event.tutor
          || (tutor.AcademyId[0] === event.tutorId))
      })

      if (matchingTutor) {
        return {
          ...event,
          photo: matchingTutor.Photo,
        };
      }

      return event;
    });

    const sortedEvents = updatedEvents.sort((a, b) => {
      const startDateA = new Date(a.start);
      const startDateB = new Date(b.start);

      return startDateB - startDateA;
    })
    setSortedEvents(sortedEvents)
    setEventsWithPhoto(updatedEvents);

  }, [events, shortlist]);

  return (
    <table>
      <thead className="thead-light">
        <tr>
          <th>Photo</th>
          <th scope="col" className='col-md-3'>Date</th>
          <th scope="col" className='col-md-2'>Lesson</th>
          <th scope="col" className='col-md-3'>Rating</th>
          <th scope="col">Comment</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {sortedEvents.map((event, index) => (
          <tr key={index}>
            <td>
              <Tooltip text={event.studentId}>
                <img src={event.photo} alt={event.studentId} height={60} width={60} />
              </Tooltip>
            </td>
            <td>{showDate(convertToDate(event.start), wholeDateFormat)}</td>
            <td>{event.subject}({event.type})</td>

            <td><StarRating rating={event.tutorRating} /></td>
            <td>
              <Comment comment={event.tutorComment} />
            </td>

            <td>
              
            <TAButton className={``} buttonText={'Select'}
            style={{ animation: (event.tutorFeedbackEligible && !event.tutorRating) ? 'blinking 1s infinite' : 'none' }}
              onClick={() => setSelectedEvent(event)} disabled={!event.tutorFeedbackEligible}
              />
              {/* <button className={`btn ${selectedEvent.id === event.id ? 'btn-success' : 'btn-primary'} `}
                style={{ animation: (event.tutorFeedbackEligible && !event.tutorRating) ? 'blinking 1s infinite' : 'none' }}
                onClick={() => setSelectedEvent(event)} disabled={!event.tutorFeedbackEligible}>Select</button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SessionsTable;
