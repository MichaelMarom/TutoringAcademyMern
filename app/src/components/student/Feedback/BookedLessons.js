import React, { useEffect, useState } from 'react';
import { wholeDateFormat } from '../../../constants/constants';
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import Comment from './Comment';
import StarRating from './StarRating';
import { convertToDate } from '../../common/Calendar/Calendar';
import { useSelector } from 'react-redux';

function BookedLessons({
  events,
  handleRowSelect,
  selectedEvent,
  setEvents
}) {

  const { shortlist } = useSelector(state => state.shortlist)
  const [tutorPhoto, setTutorPhoto] = useState(null);

  useEffect(() => {
    const updatedEvents = events.map(event => {
      const matchingTutor = shortlist.find(tutor => tutor.tutorData.AcademyId === event.tutor);

      if (matchingTutor) {
        return {
          ...event,
          photo: matchingTutor.tutorData.Photo,
        };
      }

      return event;
    });

    setEvents(updatedEvents);
  }, [events, shortlist]);

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
        {events.map((event, index) => (
          <tr key={index}>
            <td>
              <img src={event.photo} alt="tutor image" height={60} width={60} />
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
                onClick={() => handleRowSelect(event)}>Select</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookedLessons;
