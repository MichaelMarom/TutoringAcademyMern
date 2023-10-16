import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import {v4} from 'uuid';
import Pusher from 'pusher-js';


const StudentLecturePanel = () => {
  
    let location = useLocation()
    let navigate = useNavigate()

    let [role, setRole] = useState('0');
    let [lessons, setLessons] = useState('')

    useEffect(() => {
        socket.emit('getLecture', '');
    })

    useEffect(() => {
        socket.on('getLecture', result => {
            
            let lesson = result.map(item => 
                <div className="col shadow-sm m-2" key={item._id}>
                    <div className="card">
                    
                    <div className="card-body">
                        <h5 className="card-title">English Lecture With Mrs Ogoo</h5>
                        <h6 className="card-time">{item.lectureTimeStart} - {item.lectureTimeEnd}</h6>
                        <p className="card-text">{new Date(item.date).toDateString()}</p>

                        <button onClick={e => navigate(`/Class/${role}/${item.link}`)}>Join</button>
                    </div>
                    </div>
                </div>
            );

            setLessons(lesson)


        });
    })

    

    return ( 
        <StudentLayout>  
            <div className="student-lec-pane-head shadow-sm">

            </div>

            <div className="student-lec-pane-body">

                <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5  row-cols-xl-6">
                    {
                        lessons
                    }
                </div>

            </div>
        </StudentLayout>


     );
}
 
export default StudentLecturePanel;