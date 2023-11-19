import React, { useEffect, useState } from 'react';
import { wholeDateFormat } from '../../../constants/constants';
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import Comment from './Comment';
import StarRating from './StarRating';
import { convertToDate } from '../../common/Calendar/Calendar';
import { useSelector } from 'react-redux';
import Tooltip from '../../common/ToolTip';

function BookedLessons({
  events,
  handleRowSelect,
  selectedEvent,
  setEvents
}) {

  const { shortlist } = useSelector(state => state.shortlist)
  const [eventsWithPhoto, setEventsWithPhoto] = useState([])

  useEffect(() => {
    const updatedEvents = events.map(event => {
      const matchingTutor = shortlist.find(tutor => {
        return (tutor.tutorData.AcademyId === event.tutor
          || (tutor.tutorData.AcademyId === event.tutorId))
      })

      if (matchingTutor) {
        return {
          ...event,
          photo: matchingTutor.tutorData.Photo,
        };
      }

      return event;
    });

    setEventsWithPhoto(updatedEvents);
  }, [events, shortlist]);

  console.log(eventsWithPhoto)
  return (
    <table>
      <thead className="thead-light">
        <tr>
          <th>Photo</th>
          <th scope="col" className='col-md-3'>Date</th>
          <th scope="col" className='col-md-2'>Lesson</th>
          <th scope="col">Subject</th>
          <th scope="col" className='col-md-3'>Rating</th>
          <th scope="col">Comment</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {eventsWithPhoto.map((event, index) => (
          <tr key={index} style={{ 
            animation: event.feedbackEligible ? 'blinking 1s infinite' : 'none' }}>
            <td>
              <Tooltip text={event.tutorId}>
                <img src={event.photo} alt={event.tutorId} height={60} width={60} />
              </Tooltip>
            </td>
            <td>{showDate(convertToDate(event.start), wholeDateFormat)}</td>
            <td>{event.subject}</td>
            <td>{event.title}</td>

            <td><StarRating rating={event.rating} /></td>
            <td>
              <Comment comment={event.comment} />
            </td>

            <td>
              <button className={`btn ${selectedEvent.id === event.id ? 'btn-success' : 'btn-primary'}`}
                onClick={() => handleRowSelect(event)} disabled={!event.feedbackEligible}>Select</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookedLessons;
