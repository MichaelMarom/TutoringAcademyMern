import React from 'react';

function BookedLessons({ events, handleRowSelect, tutor }) {
  return (
    <table>
      <thead className="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Date</th>
          <th scope="col">GMT</th>
          <th scope="col">Subject</th>
          <th scope="col">Tutor</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{event.date}</td>
            <td>{event.title}</td>
            <td>{event.subject}</td>
            <td>{tutor}</td>
            <td>
              <button onClick={() => handleRowSelect(event.id)}>Select</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookedLessons;
