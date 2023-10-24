import React from 'react';

const BookedLessons = ({ handleRowSelect }) => {
  return (
    <table>
      <thead className="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Data</th>
          <th scope="col">GMT</th>
          <th scope="col">Subject</th>
          <th scope="col">Tutor</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>Mark</td>
          <td>
            <button onClick={() => handleRowSelect(1)}>Select</button>
          </td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>@mdo</td>
          <td>
            <button onClick={() => handleRowSelect(2)}>Select</button>
          </td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Larry</td>
          <td>the Bird</td>
          <td>@twitter</td>
          <td>@mdo</td>
          <td>
            <button onClick={() => handleRowSelect(3)}>Select</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BookedLessons;
