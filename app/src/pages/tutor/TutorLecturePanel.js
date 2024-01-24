import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { v4 } from "uuid";
import axios from "axios";
import TutorLayout from "../../layouts/TutorLayout";

const TutorLecturePanel = () => {
  let location = useLocation();
  let navigate = useNavigate();

  let [role, setRole] = useState("1");
  let [lessons, setLessons] = useState("");

  let handleNewLecture = (e) => {
    let inputs = [...e.target.parentElement.querySelectorAll("input")];
    let LectureInfo = {
      link: v4(),
    };

    inputs.map((item) => (LectureInfo[item.name] = item.value));

    socket.emit("NewLecture", LectureInfo);
  };

  useEffect(() => {
    socket.on("NewLecture", (Info) => {
      Info ? alert("New Lecture Added...") : alert("New Lecture Not Added...");
    });
  }, []);

  useEffect(() => {
    socket.emit("getLecture", "");
  }, []);

  useEffect(() => {
    socket.on("getLecture", (result) => {
      let lesson = result.map((item) => (
        <div className="col shadow-sm m-2" key={item._id}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">English Lecture With Mrs Ogoo</h5>
              <h6 className="card-time">
                {item.lectureTimeStart} - {item.lectureTimeEnd}
              </h6>
              <p className="card-text">{new Date(item.date).toDateString()}</p>

              <button onClick={(e) => navigate(`/Class/${role}/${item.link}`)}>
                Join
              </button>
            </div>
          </div>
        </div>
      ));

      setLessons(lesson);
    });
  });

  return (
    <TutorLayout showLegacyFooter={false}>
      <div className="student-lec-pane-head shadow-sm"></div>

      <div className="student-lec-pane-body">
        <div className="row row-cols-1 row-cols-md-4 row-cols-lg-5  row-cols-xl-6">
          <div className="col shadow-sm m-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Create New Lecture For Student</h5>
                <input
                  type="date"
                  style={{
                    height: "35px",
                    width: "150px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  name="date"
                  id=""
                />

                <h6>Set Time Range</h6>
                <br />
                <label htmlFor="">From</label>
                <input
                  type="time"
                  style={{
                    height: "30px",
                    width: "150px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  name="lectureTimeStart"
                  id=""
                />

                <br />
                <label htmlFor="">To</label>
                <input
                  type="time"
                  style={{
                    height: "30px",
                    width: "150px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  name="lectureTimeEnd"
                  id=""
                />

                <p className="card-text"></p>

                <button onClick={handleNewLecture}> Create Lecture</button>
              </div>
            </div>
          </div>

          {lessons}
        </div>
      </div>
    </TutorLayout>
  );
};

export default TutorLecturePanel;
