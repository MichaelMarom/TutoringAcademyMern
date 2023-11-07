import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BsCameraVideo, BsCloudUpload, BsTrash } from "react-icons/bs";
import moment from "moment";

import {
  get_countries,
  get_gmt,
  get_response,
  get_state,
  get_tutor_setup_by_acaId,
  get_tutor_setup_by_userId,
  post_tutor_setup,
} from "../../axios/tutor";
import containerVariants from "../constraint";
import { useDispatch } from "react-redux";
import { setscreenNameTo } from "../../redux/tutor_store/ScreenName";
import { convertGMTOffsetToLocalString } from "../../helperFunctions/timeHelperFunctions";
import ProfileVideoRecord from "./ProfileVideoRecord";
import { get_user_detail } from "../../axios/auth";

const TutorSetup = () => {
  let [fname, set_fname] = useState("");
  let [uname, set_uname] = useState("");
  let [mname, set_mname] = useState("");
  let [sname, set_sname] = useState("");
  let [cell, set_cell] = useState("");
  let [acadId, set_acadId] = useState("");
  let [add1, set_add1] = useState("");
  let [add2, set_add2] = useState("");
  let [city, set_city] = useState("");
  let [state, set_state] = useState("");
  let [zipCode, set_zipCode] = useState("");
  let [country, set_country] = useState("");
  let [timeZone, set_timeZone] = useState("");
  let [dateTime, setDateTime] = useState(moment());
  let [response_zone, set_response_zone] = useState("");
  let [intro, set_intro] = useState("");
  let [motivation, set_motivation] = useState("");
  let [headline, set_headline] = useState("");
  let [photo, set_photo] = useState("");
  let [video, set_video] = useState("");

  let [grades, setGrades] = useState([
    { grade: "1st grade" },
    { grade: "2nd grade" },
    { grade: "3rd grade" },
    { grade: "4th grade" },
    { grade: "5th grade" },
    { grade: "6th grade" },
    { grade: "7th grade" },
    { grade: "8th grade" },
    { grade: "9th grade" },
    { grade: "10th grade" },
    { grade: "11th grade" },
    { grade: "12th grade" },
    { grade: "Academic" },
  ]);
  let [tutorGrades, setTutorGrades] = useState([]);

  const { user } = useSelector((state) => state.user);

  const [email, set_email] = useState(user[0].email)
  let [countryList, setCountryList] = useState("");
  let [stateList, setStateList] = useState("");
  let [GMTList, setGMTList] = useState("");
  let [response_list, set_response_list] = useState("");
  let [recordedVideo, setRecordedVideo] = useState(null);
  let [lol123, setLol123] = useState(null);
  let [data, set_data] = useState(false);

  let dispatch = useDispatch();

  const [selectedVideoOption, setSelectedVideoOption] = useState(null);

  const handleOptionClick = (option) => setSelectedVideoOption(option);

  let handleTutorGrade = (e) => {
    let elem = e.target;
    if (elem.checked) {
      setTutorGrades((item) => [...item, elem.getAttribute("id")]);
    } else {
      let list = tutorGrades.filter((item) => item !== elem.getAttribute("id"));
      setTutorGrades(list);
    }
  };

  useEffect(() => {
    const AcademyId = localStorage.getItem('tutor_user_id')
    console.log(AcademyId, "aca id");

    const fetchTutorSetup = async () => {
      let result;
      if (user[0].role === 'admin') {

        result = await get_tutor_setup_by_acaId(AcademyId);
      }
      else {
        result = await get_tutor_setup_by_userId(user[0].SID);
      }
      localStorage.setItem("tutor_user_id", result[0]?.AcademyId);
      if (result.length) {
        let data = result[0];
        const selectedUserId = await get_user_detail(data.userId);
        console.log(selectedUserId, 'ddd')
        set_fname(data.FirstName);
        set_sname(data.LastName);
        set_mname(data.MiddleName);
        set_photo(data.Photo);
        set_cell(data.CellPhone);
        set_state(data.StateProvince);
        set_email(selectedUserId.email)
        set_city(data.CityTown);
        set_country(data.Country);
        set_response_zone(data.ResponseHrs);
        set_intro(data.Introduction);
        set_motivation(data.Motivate);
        set_timeZone(data.GMT);
        set_zipCode(data.ZipCode);
        set_headline(data.HeadLine);
        set_add1(data.Address1);
        set_add2(data.Address2);
        setTutorGrades((ITEM) => [...ITEM, data.Grades]);

        console.log(data.Grades);

        let gradeList = data.Grades?.split(",") || [];
        grades.map((item) => {
          gradeList.map((grade) =>
            item.grade === grade ? (item.ex = true) : ""
          );
        });

        let frame1 = document.querySelector(".tutor-tab-photo-frame");

        set_video(data.Video);
        setRecordedVideo(data.VideoRecorded)
        const lol12 = new Blob([data.VideoRecorded], { type: 'video/mp4' });
        setLol123(lol12)
        setSelectedVideoOption("upload");

        let img = `<img src='${data.Photo}' style='height: 100%; width: 100%; '}} alt='photo' />`;
        frame1?.insertAdjacentHTML("afterbegin", img);
      }
    };
    fetchTutorSetup();
  }, []);

  useEffect(() => {
    let id =
      window.localStorage.getItem("tutor_user_id") !== "null"
        ? window.localStorage.getItem("tutor_user_id")
        : null;
    set_acadId(id);
  }, []);

  useEffect(() => {
    let next = document.querySelector(".tutor-next");
    if (next && next.hasAttribute("id")) {
      next.removeAttribute("id");
    }
  }, []);

  useEffect(() => {
    if (document.querySelector("#fname").value !== "") {
      document.querySelector("#tutor-save").style.opacity = ".3";
      document.querySelector("#tutor-save").style.pointerEvents = "none";
    }
  }, []);

  if (document.querySelector("#tutor-save")) {
    document.querySelector("#tutor-save").onclick = async () => {
      document
        .querySelector(".save-overlay")
        .setAttribute("id", "save-overlay");
      let response = await saver();
      if (response.status === 200) {
        window.localStorage.setItem(
          "tutor_user_id",
          response.data[0]?.AcademyId
        );
        window.localStorage.setItem(
          "tutor_screen_name",
          response.data[0]?.TutorScreenname
        );
        dispatch(setscreenNameTo(response.data[0]?.TutorScreenname));
        alert(`Your New Screen Name Is ${response.data[0]?.TutorScreenname}`);
        setTimeout(() => {
          document.querySelector(".save-overlay").removeAttribute("id");
        }, 1000);

        document
          .querySelector(".tutor-popin")
          .setAttribute("id", "tutor-popin");
        document.querySelector(".tutor-popin").style.background = "#000";
        document.querySelector(".tutor-popin").innerHTML = "Success";
        setTimeout(() => {
          document.querySelector(".tutor-next").setAttribute("id", "next");
          document.querySelector(".tutor-popin").removeAttribute("id");
        }, 5000);
      } else {
        setTimeout(() => {
          document.querySelector(".save-overlay").removeAttribute("id");
        }, 1000);

        document
          .querySelector(".tutor-popin")
          .setAttribute("id", "tutor-popin");
        document.querySelector(".tutor-popin").style.background = "red";
        document.querySelector(".tutor-popin").innerHTML = "Failed";
        setTimeout(() => {
          document.querySelector(".tutor-popin").removeAttribute("id");
        }, 5000);
      }
    };
  }

  if (document.querySelector("#tutor-edit")) {
    document.querySelector("#tutor-edit").onclick = async () => {
      let input = [...document.querySelectorAll("input")].filter(
        (item) =>
          item.id !== "fname" && item.id !== "mname" && item.id !== "sname"
      );
      let select = [...document.querySelectorAll("select")];
      let textarea = [...document.querySelectorAll("textarea")];

      let doc = [
        document.querySelector(".profile-photo-cnt"),
        document.querySelector(".profile-video-cnt"),
      ];

      let field = [...input, ...select, ...textarea, ...doc];

      field.map((item) => {
        item.style.opacity = 1;
        item.style.pointerEvents = "all";
      });

      function trackChanges(inputs, selects, textareas) {
        let list = [...inputs, ...selects, ...textareas];
        list.map((item) => {
          item.onChange = () => {
            document.querySelector("#tutor-save").style.opacity = "1";
            document.querySelector("#tutor-save").style.pointerEvents = "all";
          };
        });
      }

      trackChanges(
        [...document.querySelectorAll("input")],
        [...document.querySelectorAll("select")],
        [...document.querySelectorAll("textarea")]
      );
    };
  }

  let saver = async () => {
    let response = await post_tutor_setup({
      fname,
      uname,
      mname,
      sname,
      email: user[0].email,
      cell,
      acadId,
      add1,
      add2,
      city,
      state,
      zipCode,
      country,
      timeZone,
      response_zone,
      intro,
      motivation,
      headline,
      photo,
      video,
      tutorGrades,
      userId: user[0]?.SID,
    });
    return response;
  };

  useEffect(() => {
    get_countries()
      .then((data) => {
        console.log(data);
        let list = data.recordset.map((item) => (
          <option
            key={item.Country}
            className={item.Country}
            selected={item.Country === country ? "selected" : ""}
            style={{
              height: "80px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value={item.Country}
          >
            {item.Country}
          </option>
        ));
        let head = (
          <option
            key="null"
            style={{
              height: "50px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value=""
          >
            Country
          </option>
        );

        list.unshift(head);
        setCountryList(list);
      })
      .catch((err) => {
        console.log(err);
      });

    get_gmt()
      .then((data) => {
        let list = data.recordset.map((item) => (
          <option
            key={item.GMT}
            className={item.GMT}
            selected={item.GMT === timeZone ? "selected" : ""}
            style={{
              height: "80px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value={item.GMT}
          >
            {item.GMT}
          </option>
        ));
        let head = (
          <option
            key="null"
            style={{
              height: "50px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value=""
          >
            GMT
          </option>
        );

        list.unshift(head);
        setGMTList(list);
      })
      .catch((err) => {
        console.log(err);
      });

    get_state()
      .then((data) => {
        let list = data.recordset.map((item) => (
          <option
            key={item.State}
            className={item.State}
            selected={item.State === state ? "selected" : ""}
            style={{
              height: "80px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value={item.State}
          >
            {item.State}
          </option>
        ));
        let head = (
          <option
            key="null"
            style={{
              height: "50px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value=""
          >
            State
          </option>
        );

        list.unshift(head);
        setStateList(list);
      })
      .catch((err) => {
        console.log(err);
      });

    get_response()
      .then((data) => {
        console.log(data);
        let list = data.recordset.map((item) => (
          <option
            key={item.Response}
            className={item.Response}
            selected={item.Response === response_zone ? "selected" : ""}
            style={{
              height: "80px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value={item.Response}
          >
            {item.Response}
          </option>
        ));
        let head = (
          <option
            key="null"
            style={{
              height: "50px",
              width: "100%",
              outline: "none",
              padding: "0 10px 0 10px",
              borderRadius: "0",
            }}
            value=""
          >
            Response
          </option>
        );

        list.unshift(head);
        set_response_list(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  let handleImage = () => {
    let frame = document.querySelector(".tutor-tab-photo-frame");

    let f = document.querySelector("#photo");

    let type = [...f.files][0].type;

    if (type.split("/")[0] !== "image") {
      alert("Only Image Can Be Uploaded To This Field");
    } else {
      frame.innerHTML = "";

      let reader = new FileReader();

      reader.onload = (result) => {
        let img = `<img src='${reader.result}' style='height: 100%; width: 100%; '}} alt='photo' />`;

        set_photo(reader.result);

        frame?.insertAdjacentHTML("afterbegin", img);
      };
      reader.readAsDataURL([...f.files][0]);
    }
  };

  let handleVideo = () => {
    let f = document.querySelector("#video");

    let type = [...f.files][0].type;

    if (type.split("/")[0] !== "video") {
      alert("Only Video Can Be Uploaded To This Field");
    } else {
      let reader = new FileReader({});

      reader.onload = (result) => {
        set_video(reader.result);
      };
      reader.readAsDataURL([...f.files][0]);
    }
  };

  let counter = (inputs, elem, cb, length) => {
    let charLength = inputs.length;
    cb(inputs);

    if (charLength < length) {
      elem.style.border = "1px solid black";
      elem.nextElementSibling.removeAttribute("id");
    } else {
      elem.style.border = "1px solid red";
      elem.nextElementSibling.setAttribute("id", "inputValidator");
    }
  };

  useEffect(() => {
    const localTime = convertGMTOffsetToLocalString(timeZone);
    setDateTime(localTime);
  }, [timeZone]);

  const handleVideoBlob = (blobObj) => {
    if (blobObj instanceof Blob) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        setRecordedVideo(arrayBuffer);
      };

      reader.readAsArrayBuffer(blobObj);
    }
  };
  useEffect(() => {
    console.log(recordedVideo, "vbfbvfhb");
  }, [recordedVideo]);

  return (
    <>
      <div className="tutor-popin"></div>
      <div className="save-overlay">
        <span className="save_loader"></span>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="tutor-tab-setup"
      >
        <form action="" className="pt-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>{typeof dateTime === "object" ? "" : dateTime}</p>

          </div>
          <div className="tutor-setup-top-field container">
            <div className="profile-photo-cnt">
              <h5 style={{ whiteSpace: "nowrap" }}>Profile Photo</h5>
              <input
                type="file"
                data-type="file"
                onChange={handleImage}
                style={{ display: "none" }}
                id="photo"
              />
              <div className="tutor-tab-photo-frame"></div>
              <label id="btn" htmlFor="photo">
                Upload
              </label>
            </div>


            <div className="profile-details-cnt pt-3"
              style={{ float: "left", margin: "0 10px 0 10px ", width: "40%" }}
            >

              <div
                style={{
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  First Name
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  onInput={(e) => set_fname(e.target.value)}
                  placeholder="First Name"
                  defaultValue={fname}
                  type="text"
                  id="fname"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Middle
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  onInput={(e) => set_mname(e.target.value)}
                  placeholder="Middle Name"
                  defaultValue={mname}
                  type="text"
                  id="mname"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Last Name
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  onInput={(e) => set_sname(e.target.value)}
                  placeholder="Last Name"
                  defaultValue={sname}
                  type="text"
                  id="sname"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  alignItems: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Email
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  placeholder="Email"
                  value={email}
                  type="text"
                  id="email"
                  readonly
                />
              </div>
              <div className="err-mssg">
                Email already exist, Please try something else...
              </div>

              <div
                style={{
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Cell Phone
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  onInput={(e) => set_cell(e.target.value)}
                  placeholder="Cell Phone"
                  defaultValue={cell}
                  type="text"
                  id="cellphn"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 0 10px 0",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Response Time
                </label>{" "}
                &nbsp;&nbsp;
                <select
                  onInput={(e) => set_response_zone(e.target.value)}
                  value={response_zone}
                  id="resZone"
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                    padding: "5px 5px 5px 5px",
                    margin: "0 0 10px 0",
                  }}
                >
                  {response_list}
                </select>
              </div>

            </div>

            <div className="profile-details-cnt pt-3"
              style={{ float: "right", margin: "0 10px 0 10px ", width: "40%" }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  display: "flex",
                  margin: "0 0 10px 0",
                  padding: "0",
                  justifyContent: "center",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Address 1
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  style={{
                    margin: "2.5px 0 0 0",
                    width: "70%",
                    float: "right",
                    position: "relative",
                  }}
                  onInput={(e) => set_add1(e.target.value)}
                  placeholder="Address 1"
                  defaultValue={add1}
                  type="text"
                  id="add1"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 0 10px 0",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Address 2
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  onInput={(e) => set_add2(e.target.value)}
                  placeholder="Address 2"
                  defaultValue={add2}
                  type="text"
                  id="add2"
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 0 10px 0",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  City/Town
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  onInput={(e) => set_city(e.target.value)}
                  placeholder="City/Town"
                  type="text"
                  defaultValue={city}
                  id="city"
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  State
                </label>{" "}
                &nbsp;&nbsp;
                <select
                  onInput={(e) => set_state(e.target.value)}
                  id="state"
                  value={state}
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                    padding: "5px 5px 5px 5px",
                    margin: "0 0 10px 0",
                  }}
                >
                  {stateList}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 0 10px 0",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Zip Code
                </label>{" "}
                &nbsp;&nbsp;
                <input
                  onInput={(e) => set_zipCode(e.target.value)}
                  defaultValue={zipCode}
                  placeholder="Zip-Code"
                  type="text"
                  id="zip"
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Country
                </label>{" "}
                &nbsp;&nbsp;
                <select
                  onInput={(e) => set_country(e.target.value)}
                  id="country"
                  value={country}
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                    padding: "5px",
                    margin: "0 0 10px 0",
                  }}
                >
                  {countryList}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <label style={{ width: "30%" }} htmlFor="">
                  Time Zone
                </label>{" "}
                &nbsp;&nbsp;
                <select
                  onInput={(e) => set_timeZone(e.target.value)}
                  id="timeZone"
                  value={timeZone}
                  style={{
                    float: "right",
                    width: "70%",
                    margin: "2.5px 0 0 0",
                    padding: "5px 5px 5px 5px",
                    margin: "0 0 10px 0",
                  }}
                >
                  {GMTList}
                </select>
              </div>


            </div>

            <div className="profile-video-cnt mt-3 "
              style={{ float: "right", width: "70%", height: "250px" }}
            >
              {selectedVideoOption === "record" ? (
                <div className="w-100">
                  <ProfileVideoRecord handleVideoBlob={handleVideoBlob} />
                </div>
              ) : selectedVideoOption === "upload" && video?.length ? (
                <div className="tutor-tab-video-frame p-3 card">
                  <video src={video} className="w-100 h-100"
                  controls autoplay
                  />
                </div>
              ) :
                <div className="tutor-tab-video-frame p-3 card">
                </div>
              }

              <div className="container mt-2">
                <div className="row justify-content-center align-items-center">
                  <div className="col-md-4">
                    <div className="text-center">
                      <button
                        type="button"
                        className={`btn btn-primary small ${selectedVideoOption === "record" ? "active" : ""
                          }`}
                        style={{ fontSize: "10px" }}
                        onClick={() => {
                          set_video("");
                          handleOptionClick("record");
                        }}
                      >
                        <BsCameraVideo size={15} />
                        <br />
                        Record Video
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <input
                        data-type="file"
                        defaultValue={video}
                        onChange={handleVideo}
                        type="file"
                        style={{ display: "none" }}
                        id="video"
                      />
                      <label
                        id="btn"
                        htmlFor="video"
                        style={{ fontSize: "10px" }}
                        className={`btn btn-warning ${selectedVideoOption === "upload" ? "active" : ""
                          }`}
                        onClick={() => handleOptionClick("upload")}
                      >
                        <BsCloudUpload size={15} /> <br />
                        Upload Video
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <button
                        type="button"
                        style={{ fontSize: "10px" }}
                        className={`btn btn-danger `}
                        onClick={() => set_video("")}
                      >
                        <BsTrash size={15} />
                        <br />
                        Delete Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              fontWeight: "bold",
              margin: "auto",
              textAlign: "center",
              width: "60%",
            }}
          >
            <label s htmlFor="headline">
              Grades I teach
            </label>
            <br />
            <div className="tutor-grades">
              <ul>
                {grades.map((item) => {
                  return (
                    <li>
                      <div
                        className="input-cnt"
                        style={{
                          width: "fit-content",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {item.ex ? (
                          <input
                            style={{
                              background: "blue",
                              color: "blue",
                              height: "25px",
                              width: "25px",
                            }}
                            defaultChecked
                            type="checkbox"
                            id={item.grade}
                            onInput={handleTutorGrade}
                            className="grades"
                          />
                        ) : (
                          <input
                            style={{
                              background: "blue",
                              color: "blue",
                              height: "25px",
                              width: "25px",
                            }}
                            type="checkbox"
                            id={item.grade}
                            onInput={handleTutorGrade}
                            className="grades"
                          />
                        )}
                        &nbsp;
                        <label htmlFor={item.grade}>{item.grade}</label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            style={{
              fontWeight: "bold",
              margin: "auto",
              textAlign: "center",
              width: "60%",
            }}
          >
            <label s htmlFor="headline">
              Headline
            </label>
            <br />
            <input
              defaultValue={headline}
              maxLength={80}
              placeholder="Write A Catchy Headline.. Example: 21 years experienced nuclear science professor."
              onInput={(e) =>
                counter(e.target.value, e.target, set_headline, 80)
              }
              type="text"
              style={{ width: "80%", height: "50px", margin: "0 0 10px 0" }}
            />
            <div className="inputValidator">
              Your have reached the max limit of 80 characters.
            </div>
          </div>

          <div className="tutor-setup-bottom-field">
            <div
              className="profile-headline"
              style={{ textAlign: "center", float: "left" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="intro">
                Introduction
              </label>
              <br />
              <textarea
                defaultValue={intro}
                maxLength={500}
                placeholder="Write Your Introduction Here... e.g: (My name is Fabian and i am a graduate of Harvard University in Boston...)"
                onInput={(e) =>
                  counter(e.target.value, e.target, set_intro, 500)
                }
                style={{ width: "80%", padding: "10px", height: "160px" }}
                name=""
                id=""
              ></textarea>
              <div className="inputValidator">
                Your have reached the max limit of 500 characters.
              </div>
            </div>

            <div
              className="profile-motivation"
              style={{ textAlign: "center", float: "right" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="intro">
                Motivate
              </label>
              <br />
              <textarea
                defaultValue={motivation}
                maxLength={500}
                placeholder='Write Something That will motivate Your Students. Use the "Motivate" tab to set up your promotions. Like up to 30 minutes introductionary session. Discount for multi students tutoring, or paid subscription for multi lessons...If you hold a teacher certificate, and wish to provide your profession to a full class of students in a public school, you can charge the school a premium.  '
                onInput={(e) =>
                  counter(e.target.value, e.target, set_motivation)
                }
                style={{ width: "80%", padding: "10px", height: "160px" }}
                name=""
                id=""
              ></textarea>
              <div className="inputValidator">
                Your have reached the max limit of 500 characters.
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default TutorSetup;
