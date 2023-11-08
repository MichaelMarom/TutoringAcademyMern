import React from 'react';
import { wholeDateFormat } from '../../../constants/constants';
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import Comment from './Comment';
import StarRating from './StarRating';

function BookedLessons({
  events,
  handleRowSelect,
  selectedEvent
}) {
  console.log(events);
  return (
    <table>
      <thead className="thead-light">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Lesson</th>
          <th scope="col">Subject</th>
          <th scope="col">Rating</th>
          <th scope="col">Comment</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index}>
            <td>{showDate(event.start, wholeDateFormat)}</td>
            <td>{event.subject}</td>
            <td>{event.title}</td>

            <td><StarRating rating={event.rating} /></td>
            <td>
             <Comment comment={event.comment} />
            </td>

            <td>
              <button className={`btn ${selectedEvent.id === event.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleRowSelect(event)}>Select</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookedLessons;
