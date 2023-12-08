import { useEffect, useState } from 'react';
import { get_tutor_students } from '../../axios/tutor';

const MyStudents = () => {
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const AcademyId = localStorage.getItem('tutor_user_id');
          const response = await get_tutor_students(AcademyId);
          setStudents(response.data);
        } catch (error) {
          console.error('Error fetching students:', error);
          // Handle error, e.g., display an error message
        }
      };
  
      fetchStudents();
    }, []);

    console.log('Student', students);
  
    return (
        <div className="mt-4">
          <h2>My Students</h2>
          <table className="">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Screen Name</th>
                <th>Subject</th>
                <th>Country</th>
                <th>GMT</th>
                <th>Grade</th>
                <th>MultiRate Hours</th>
                <th>MultiRate Paid</th>
                <th>MultiRate Balance</th>
                <th>Rate</th>
                <th>Discount Hours</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    {/* Assuming your student object has a property for the photo URL */}
                    {/* <img src={student.photo} alt="Student" style={{ width: '50px', height: '50px' }} /> */}
                  </td>
                  <td>{student.ScreenName}</td>
                  <td>{student.Subject}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{student.Rate}</td>
                  <td>{student.DiscountHours}</td>
                  <td>{new Date(student.date).toLocaleString()}</td>
                  {/* Add more cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
  
  
  export default MyStudents;