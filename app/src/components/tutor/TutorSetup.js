import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BsCameraVideo, BsCloudUpload, BsTrash } from "react-icons/bs";
import { moment } from "../../config/moment";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { toast } from 'react-toastify'

import {
  post_tutor_setup,
} from "../../axios/tutor";
import { useDispatch } from "react-redux";
import { setscreenNameTo } from "../../redux/tutor_store/ScreenName";
import { convertGMTOffsetToLocalString, showDate } from "../../helperFunctions/timeHelperFunctions";
import ProfileVideoRecord from "./ProfileVideoRecord";
import Loading from "../common/Loading";
import ToolTip from '../common/ToolTip'

import Actions from '../common/Actions'
import { uploadVideo } from "../../redux/tutor_store/video";
import { AUST_STATES, CAN_STATES, Countries, GMT, RESPONSE, UK_STATES, US_STATES } from "../../constants/constants";
import { setTutor } from "../../redux/tutor_store/tutorData";
import { unsavedChangesHelper } from "../../helperFunctions/generalHelperFunctions";
import ReactDatePicker from "react-datepicker";


const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const TutorSetup = () => {
  const [editMode, setEditMode] = useState(false);
  let [fname, set_fname] = useState("");
  let [mname, set_mname] = useState("");
  let [lname, set_sname] = useState("");
  let [cell, set_cell] = useState("");
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

  let grades = [
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
  ]

  let [tutorGrades, setTutorGrades] = useState([]);
  const isValid = isPhoneValid(cell);
  const { user } = useSelector((state) => state.user);
  const [email, set_email] = useState(user[0].email);
  const [unSavedChanges, setUnsavedChanges] = useState(false);
  let [countryList, setCountryList] = useState("");
  let [GMTList, setGMTList] = useState("");
  let [response_list, set_response_list] = useState("");
  let [recordedVideo, setRecordedVideo] = useState(null);
  let [userExist, setUserExist] = useState(false);
  const [uploadPhotoClicked, setUploadPhotoClicked] = useState(false)
  const [uploadVideoClicked, setUploadVideoClicked] = useState(false)
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem("user"))[0].SID)
  const [picUploading, setPicUploading] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);

  const [vacation_mode, set_vacation_mode] = useState(false)
  const [start, setStart] = useState(moment().toDate());
  const [end, setEnd] = useState(null)

  const [dbCountry, setDBCountry] = useState(null)

  const { tutor, isLoading: tutorDataLoading } = useSelector(state => state.tutor)
  const { isLoading } = useSelector(state => state.video)

  const options = {
    "Australia": AUST_STATES,
    "USA": US_STATES,
    "Canada": CAN_STATES,
    "UnitedKingdom": UK_STATES
  }

  useEffect(() => {
    if (country !== dbCountry) {
      set_state('')
    }
  }, [country, dbCountry])
  let dispatch = useDispatch();

  const [selectedVideoOption, setSelectedVideoOption] = useState(null);

  const handleOptionClick = (option) => {
    setUploadVideoClicked(true);
    setSelectedVideoOption(option);
  }

  let handleTutorGrade = (grade) => {

    if (tutorGrades.some(item => item === grade)) {
      const removedGrades = tutorGrades.filter(item => item !== grade)
      setTutorGrades(removedGrades);
    }
    else
      setTutorGrades([...tutorGrades, grade]);

  };

  //upload photo
  useEffect(() => {
    const postImage = async () => {
      if (uploadPhotoClicked && userExist) {
        setPicUploading(true)
        const { data } = await post_tutor_setup({ photo, fname, lname, mname, userId })
        setPicUploading(false)

        console.log()
        setUploadPhotoClicked(false)
        // set_photo(data[0].Photo)
        dispatch(setTutor())

        console.log(data, 'upk9ad photo')
      }
    }
    postImage()
  }, [photo, userExist])

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  //upload video
  useEffect(() => {
    const upload_video = async () => {
      if (uploadVideoClicked && userExist) {
        // setUploadingVideo(true)
        // await post_tutor_setup({ video, fname, lname, mname })
        // setUploadingVideo(false)
        dispatch(uploadVideo({ video, fname, lname, mname, userId }))
        // dispatch(setTutor())
        console.log('upk9ad video')
      }
    }
    upload_video()
  }, [video])

  useEffect(() => {
    const fetchTutorSetup = async () => {
      if (tutor) {
        let data = tutor;

        setUserId(tutor.userId)
        setUserExist(true)
        set_fname(data.FirstName);
        set_sname(data.LastName);
        set_mname(data.MiddleName);
        set_photo(data.Photo);
        set_cell(data.CellPhone);
        set_state(data.StateProvince);
        set_email(data.email)
        set_city(data.CityTown);
        set_country(data.Country);
        setDBCountry(data.Country)
        set_response_zone(data.ResponseHrs);
        set_intro(data.Introduction);
        set_motivation(data.Motivate);
        set_timeZone(data.GMT);
        set_zipCode(data.ZipCode);
        set_headline(data.HeadLine);
        set_add1(data.Address1);
        set_add2(data.Address2);
        setTutorGrades(JSON.parse((data?.Grades ?? '[]')));

        set_video(data.Video);
        setRecordedVideo(data.VideoRecorded)
        setSelectedVideoOption("upload");
        console.log(data.VacationMode)
        set_vacation_mode(data.VacationMode)
        setStart(data.StartVacation)
        setEnd(data.EndVacation)
      }
      setUploadPhotoClicked(false)
    };
    fetchTutorSetup();
  }, [tutor]);

  useEffect(() => {
    if (tutor.AcademyId !== undefined) {
      let formValues = {
        fname,
        mname,
        lname,
        cell,
        add1,
        add2,
        city,
        state,
        zipCode,
        country,
        timeZone,
        dateTime,
        response_zone,
        intro,
        motivation,
        headline,
        photo,
        video,
        tutorGrades,
        start,
        end,
        vacation_mode,
      }
      setUnsavedChanges(unsavedChangesHelper(formValues, tutor))
    }

  }, [fname, mname, lname, cell, add1, add2, city, state, zipCode, country, timeZone, dateTime,
    response_zone, intro, motivation, headline, photo, video, tutorGrades, tutor, start, end, vacation_mode])

  const saveTutorSetup = async (e) => {
    e.preventDefault()
    if (!isValid) {
      return toast.warning("please enter the correct phone number");
    }
    if (!video || !photo)
      toast.warning('Since You did not uploaded your photo or Video, your Profile will stay in Pending status, and can not be activated until you upload the missing items!')
    if (!tutorGrades?.length > 0) {
      return toast.warning("Please select at least one grade");
    }

    setSavingRecord(true)
    let response = await saver();
    setSavingRecord(false)

    if (response.status === 200) {
      dispatch(setTutor())
      window.localStorage.setItem(
        "tutor_screen_name",
        response.data[0]?.TutorScreenname
      );
      dispatch(setscreenNameTo(response.data[0]?.TutorScreenname));
      setEditMode(false);
      toast.success("Data saved successfully");
    }
    else {
      toast.error("Error saving the Data ")
    }
  }

  let saver = async () => {
    let response = await post_tutor_setup({
      fname,
      mname,
      lname,
      cell,
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
      tutorGrades,
      userId: tutor.userId ? tutor.userId : user[0].SID,
      grades: tutorGrades,
      start,
      end,
      vacation_mode
    });
    return response;
  };

  useEffect(() => {
    const sortedCountries = Countries.sort((a, b) => a.Country.localeCompare(b.Country));
    let countries = sortedCountries.map((item) => (
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
    let countries_select_head = (
      <option
        key="null"
        value={''}
        style={{
          height: "50px",
          width: "100%",
          outline: "none",
          padding: "0 10px 0 10px",
          borderRadius: "0",
        }}
        selected
        disabled
      >
        Country
      </option>
    );

    countries.unshift(countries_select_head);
    setCountryList(countries);



    let list = GMT.map((item) => (
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
        Select
      </option>
    );

    list.unshift(head);
    setGMTList(list);

    let response_list = RESPONSE.map((item) => (
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
    let response_head = (
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
        Select
      </option>
    );

    response_list.unshift(response_head);
    set_response_list(response_list);

  }, []);

  let handleImage = () => {
    setUploadPhotoClicked(true)
    // let frame = document.querySelector(".tutor-tab-photo-frame");

    let f = document.querySelector("#photo");

    let type = [...f.files][0].type;

    if (type.split("/")[0] !== "image") {
      alert("Only Image Can Be Uploaded To This Field");
    } else {
      // frame.innerHTML = "";

      let reader = new FileReader();

      reader.onload = (result) => {
        // let img = `<img src='${reader.result}' style='height: 100%; width: 100%; '}} alt='photo' />`;

        set_photo(reader.result);

        // frame?.insertAdjacentHTML("afterbegin", img);
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
    let charLength = inputs?.length;
    cb(inputs);

    if (charLength < length) {
      elem.style.border = "1px solid black";
      elem.nextElementSibling?.removeAttribute("id");
    } else {
      elem.style.border = "1px solid red";
      elem.nextElementSibling?.setAttribute("id", "inputValidator");
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


  const formatUTC = (dateInt, addOffset = false, startDate = false) => {
    let date = (!dateInt || dateInt.length < 1) ? new Date : new Date(dateInt);
    const currentDate = new Date();
    if (date < currentDate) {
      return null; // You can also throw an error here if you prefer
    }
    if (typeof dateInt === "string") {
      return date;
    } else {
      if (startDate) {
        date.setHours(0)
        date.setMinutes(0)
      }
      else {
        date.setHours(23)
        date.setMinutes(59)
      }
      console.log(date, moment(date).tz(), date.getHours(), date.getDate(), date.getFullYear(), date.getMonth() + 1)
      console.log(date.getHours())
      return date;
    }
  }

  const gmtInInt = parseInt(tutor.GMT)
  // for reactdatepicker because it opertae on new Date() not on moment.
  // getting getLocalGMT and then multiple it with -1 to add (-5:00) or subtract (+5:00)
  const getLocalGMT = parseInt((offset => (offset < 0 ? '+' : '-') + ('00' + Math.abs(offset / 60 | 0)).slice(-2) + ':' + ('00' + Math.abs(offset % 60)).slice(-2))(new Date().getTimezoneOffset())) * -1;

  if (tutorDataLoading || savingRecord)
    return <Loading height="80vh" />
  return (
    <form onSubmit={saveTutorSetup} className="pt-4">
      <div style={{ overflowY: "auto", height: "77vh" }}>

        <div className="tutor-setup-top-field container justify-content-between" style={{ gap: "25px" }}>
          <div className="profile-photo-cnt " style={{ width: "15%" }}>
            <h5 style={{ whiteSpace: "nowrap" }}>Profile Photo</h5>
            <input
              type="file"
              data-type="file"
              name="photo"
              onChange={handleImage}
              style={{ display: "none" }}
              id="photo"
            />
            <div className="mb-2 w-100 h-100">
              {picUploading && <Loading height="10px" iconSize="20px" loadingText="uploading picture ..." />}
            </div>
            <div className="w-100 h-100" style={{ border: "1px dotted black" }}>
              {photo ? <img src={photo} style={{ height: ' 100%', width: ' 100%' }} alt='photo' /> :
                `You must upload your picture, and video on this tab.  
                  You are permitted to move to next tabs without validating that, but your account will not be activated until it’s done`
              }
            </div>

            <label id="btn" style={{ pointerEvents: !editMode ? "none" : "auto" }} type="label" disabled={!editMode} htmlFor="photo" className="btn btn-success mt-2">
              Upload
            </label>
          </div>


          <div className="profile-details-cnt pt-3" style={{ width: "25%" }}>
            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                First Name
              </label>
              <input
                required
                onChange={(e) => set_fname(e.target.value)}
                placeholder="First Name"
                value={fname}
                type="text"
                id="fname"
                className="form-control m-0"
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Middle
              </label>
              <input
                onInput={(e) => set_mname(e.target.value)}
                placeholder="Middle Name"
                value={mname}
                className="form-control m-0"
                type="text"
                // disabled
                id="mname"
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Last Name
              </label>
              <input
                required
                onInput={(e) => set_sname(e.target.value)}
                placeholder="Last Name"
                value={lname}
                type="text"
                id="lname"
                // disabled
                className="form-control m-0"
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",
                alignItems: "center",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Email
              </label>
              <input
                className="form-control m-0"
                required

                placeholder="Email"
                value={email}
                type="text"
                id="email"
                readonly
                disabled
              />
            </div>

            <div
              style={{
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            >
              <label className="w-50 input-group-text" htmlFor="">
                Cell Phone
              </label>

              <PhoneInput
                defaultCountry="us"
                value={cell}
                onChange={(cell) => set_cell(cell)}
                required
                disabled={!editMode}
                style={{ width: "66%" }}
              />



            </div>

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="" style={{ fontSize: "14px" }}>
                Response Time <ToolTip width="200px" text="Select your response time answering the student during business time in your time zone. Please take notice that the student take this fact as one of the considurations of selecting you as tutor." />
              </label>
              <select
                className="form-select m-0"
                onInput={(e) => set_response_zone(e.target.value)}
                value={response_zone}
                id="resZone"
                disabled={!editMode}
                required
              >
                {response_list}
              </select>

            </div>

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Time Zone <ToolTip width="200px" text={"Select the Greenwich Mean Time (GMT) zone where you reside. It will let the student configure his time availability conducting lessons with you, when in a different time zone. "} />
              </label>
              <select
                className="form-select m-0"
                onInput={(e) => set_timeZone(e.target.value)}
                id="timeZone"
                disabled={!editMode}
                value={timeZone}
                required
              >
                {GMTList}
              </select>


            </div>
          </div>

          <div className="profile-details-cnt pt-3" style={{ width: "25%" }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                display: "flex",
                margin: "0 0 10px 0",
                padding: "0",

                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="" style={{ fontSize: "14px" }}>
                Address 1
              </label>
              <input
                className="form-control m-0"
                required

                onInput={(e) => set_add1(e.target.value)}
                placeholder="Address 1"
                value={add1}
                type="text"
                id="add1"
                disabled={!editMode}
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                Address 2
              </label>
              <input
                className="form-control m-0"
                onInput={(e) => set_add2(e.target.value)}
                placeholder="Optional"
                value={add2}
                disabled={!editMode}
                type="text"
                id="add2"
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                margin: "0 0 10px 0",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                City/Town
              </label>
              <input
                className="form-control m-0"
                required
                onInput={(e) => set_city(e.target.value)}
                placeholder="City/Town"
                type="text"
                value={city}
                id="city"
                disabled={!editMode}
              />
            </div>
            <div
              style={{ display: "flex", width: "100%", alignItems: "center", margin: "0 0 10px 0", display: "flex", whiteSpace: "nowrap" }}>
              <label className="input-group-text w-50" htmlFor="country">
                Country
              </label>
              <select
                className="form-select m-0"
                onInput={(e) => set_country(e.target.value)}
                id="country"
                value={country}
                disabled={!editMode}
                required
              >
                {countryList}
              </select>
            </div>
            {(options[country] ?? [])?.length ?

              <div
                className="mb-2"
                style={{
                  display: (options[country] ?? [])?.length ? 'flex' : 'none',
                  width: "100%",

                  alignItems: "center",
                  display: "flex",

                  whiteSpace: "nowrap",
                }}
              >
                <label className="input-group-text w-50" htmlFor="">
                  State/Province
                </label>

                {(options[country] ?? [])?.length ?
                  <select
                    className="form-select "
                    required
                    onInput={(e) => set_state(e.target.value)}
                    id="state"
                    disabled={!editMode}
                    value={state}
                  >
                    <option value='' selected disabled>Select State</option>
                    {(options[country] ?? []).map((item) => <option value={item}>{item}</option>)}
                  </select> :
                  <input className="form-control m-0" disabled type="text" value={state} onChange={(e) => set_state(e.target.value)} />
                }
              </div> : ''}

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                margin: "0 0 10px 0",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <span className="input-group-text w-50" htmlFor="">
                Zip Code
              </span>
              <input
                className="form-control m-0"
                required
                onInput={(e) => set_zipCode(e.target.value)}
                value={zipCode}
                disabled={!editMode}
                placeholder="Zip-Code"
                type="text"
                id="zip"
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",

                alignItems: "center",
                display: "flex",

                whiteSpace: "nowrap",
              }}
            >
              <label className="input-group-text w-50" htmlFor="">
                UTC  <ToolTip width="200px" text={"Coordinated Universal Time or 'UTC' is the primary time standard by which the world regulate local time. "} />
              </label>
              <input
                className="form-control m-0"
                disabled
                value={typeof dateTime === "object" ? "" : dateTime}
              />
            </div>

          </div>

          <div className="profile-video-cnt mt-3 "
            style={{ float: "right", width: "30%", height: "250px" }}
          >
            <h6>Tutor's introduction video</h6>
            <div className="mb-2">
              {isLoading && <Loading height="10px" iconSize="20px" loadingText="uploading video ..." />}
            </div>
            {selectedVideoOption === "record" ? (
              <div className="w-100">
                <ProfileVideoRecord handleVideoBlob={handleVideoBlob} />
              </div>
            ) : selectedVideoOption === "upload" && video?.length ? (
              <div className="" style={{ border: "1px dotted black" }}>
                <video src={video} className="w-100 h-100"
                  controls autoplay
                />
              </div>
            ) :
              <div className="tutor-tab-video-frame p-2 card">
                <div style={{ textAlign: "justify", fontSize: "13px" }}> Providing your video, is mandatory. Your registration is at the stage of 'pending' until you upload it. An introduction video is a great way to showcase your personality, skills and teaching style for potential students. It can help you stand out from other tutors and attract more atudents. Creating your video, briefly introduce yourself, your experience and your approach to tutoring. Mention what subjects and levels you can teach, and how you can help students achieve their goals. You should speak clearly, and confidently. A good introduction video can make a lasting impression and increase your chances of getting hired.
                </div>
              </div>
            }

            <div className=" mt-2">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-4">
                  <div className="text-center">
                    <button
                      type="button"
                      className={`btn btn-primary small ${selectedVideoOption === "record" ? "active" : ""
                        }`}
                      disabled={!editMode}
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
                    {/* {video?.length ? */}
                    <input
                      data-type="file"
                      defaultValue={''}
                      onChange={handleVideo}
                      type="file"
                      name="video"
                      style={{ display: "none" }}
                      id="video"
                    />
                    {/* : null} */}
                    <label
                      id="btn"
                      type="button"
                      htmlFor="video"
                      style={{ pointerEvents: !editMode ? "none" : "auto", fontSize: "10px" }}
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
                      disabled={!editMode}>
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


        <hr className="shadow" />
        <div className="container">
          <div className="d-flex justify-content-between">
            <div
              className="border rounded p-2 mt-2 shadow"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                width: "50%",
              }}
            >
              <label >
                Grades I teach
              </label>
              <br />
              <div className="tutor-grades">
                <ul>
                  {grades.map((item) => {
                    const isChecked = tutorGrades.includes(item.grade);
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
                          <input
                            style={{
                              background: "blue",
                              color: "blue",
                              height: "25px",
                              width: "25px",
                            }}
                            type="checkbox"
                            checked={isChecked}
                            disabled={!editMode}
                            id={item.grade}
                            onInput={() => handleTutorGrade(item.grade)}
                            className=" grades"
                          />

                          &nbsp;
                          <label htmlFor={item.grade}>{item.grade}</label>
                        </div>
                      </li>
                    );

                  })}
                </ul>
              </div>

            </div>
            <div className="border p-2 shadow rounded" style={{ width: "40%" }}>
              <div className="form-check form-switch d-flex gap-3" style={{ fontSize: "16px " }}>
                <input
                  disabled={!editMode}
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  style={{
                    width: "30px",
                    height: "15px"
                  }}
                  onChange={() => set_vacation_mode(!vacation_mode)}
                  checked={vacation_mode}
                />
                <label className="form-check-label mr-3" for="flexSwitchCheckChecked" >
                  Vacation Mode
                </label>
                <ToolTip text="Turn the switch to 'On' to block the period of time you do not want to tutor. A light green color will indicate your selected period on your calendar. 
                Then students will not be able to book lessons with you for that period. 
                By the end date, the switch will turn to 'Off' automatically." width="200px" />
              </div>
              {vacation_mode &&
                <div>
                  <h6 className="text-start">Enter Start and end Date</h6>
                  <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                    <ReactDatePicker
                      disabled={!editMode}
                      selected={new Date(moment(start).toDate().getTime() + (gmtInInt + getLocalGMT) * 60 * 60 * 1000)}
                      onChange={date => {
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        const originalMoment = moment.tz(date, tutor.timeZone).startOf('day');
                        const utcMomentStartDate = originalMoment.clone();
                        // utcMomentStartDate.utc()
                        console.log(originalMoment.get('hour'), utcMomentStartDate.get('hour'), originalMoment.get('date'), date.getDate(), date.getHours())
                        setStart(utcMomentStartDate)
                      }}
                      dateFormat="MMM d, yyyy"
                      className="form-control"
                    />

                    <h6 className="m-0">and</h6>
                    <ReactDatePicker
                      disabled={!editMode}
                      selected={moment(end).toDate()}
                      onChange={date => {
                        date.setHours(0);
                        date.setMinutes(0)
                        date.setSeconds(0)
                        const originalMoment = moment(date).endOf('day').utc();
                        setEnd(originalMoment.toISOString())
                      }}
                      dateFormat="MMM d, yyyy"
                      className="form-control"
                    />
                  </div>
                  {/* <h6 className="text-start m-0 text-primary">You have selected vacation from {showDate(start) }</h6> */}
                </div>
              }
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
            <label htmlFor="headline">
              Headline
            </label>
            <br />
            <input
              className="form-control m-0 shadow"
              value={headline}
              maxLength={80}
              required
              spellcheck="true"
              disabled={!editMode}
              placeholder="Write A Catchy Headline.. Example: 21 years experienced nuclear science professor."
              onInput={(e) =>
                counter(e.target.value, e.target, set_headline, 80)
              }
              type="text"
              style={{ width: "100%", height: "50px", margin: "0 0 10px 0" }}
            />
            <div className="inputValidator">
              Your have reached the max limit of 80 characters.
            </div>
          </div>

          <div className="tutor-setup-bottom-field d-flex justify-content-between"
            style={{ gap: "20px" }}>
            <div
              className="profile-headline"
              style={{ textAlign: "center", float: "left" }}
            >
              <label style={{ fontWeight: "bold" }} htmlFor="intro">
                Introduction
              </label>
              <br />
              <textarea
                className="form-control m-0 shadow"
                value={intro}
                maxLength={500}
                required
                placeholder="The Academy mandates the tutor uploading a self introductionary video. 
                    It's important for the student to check if the tutor accent is clear for him.
                    A self-introduction video is a great way to showcase your personality and teaching style to potential students. 
                    Here are some tips on how to create a self-introduction video of tutor to students.
                    
                    - Start with a friendly greeting and introduce yourself by name, location and subject you teach.
                    - Explain why you are passionate about teaching and what you can offer to your students, such as your qualifications, experience, teaching methods and goals.
                    - Give some examples of how you make your lessons engaging, interactive and fun, such as using multimedia, games, quizzes or real-life scenarios.
                    - End with a call to action, such as inviting the students to book a trial lesson with you or to check out your profile for more information.
                    - Keep your video short and concise, ideally between 45-90 seconds.
                    - Use a clear and professional tone, avoid slang, jargon or filler words.
                    - Record your video in a quiet and well-lit place, with a neutral background and good audio quality.
                    - Review your video before uploading it and make sure it is error-free and reflects your best self.
                    "
                onInput={(e) =>
                  counter(e.target.value, e.target, set_intro, 500)
                }
                style={{ width: "100%", padding: "10px", height: "160px" }}
                name=""
                spellcheck="true"
                disabled={!editMode}
                id=""
              ></textarea>
              <div className="inputValidator">
                Your have reached the max limit of 1500 characters.
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
                className="form-control m-0 shadow"
                value={motivation}
                disabled={!editMode}
                maxLength={500}
                required
                placeholder='Write Something That will motivate Your Students. Use the "Motivate" tab to set up your promotions. Like up to 30 minutes introductionary session. Discount for multi students tutoring, or paid subscription for multi lessons...If you hold a teacher certificate, and wish to provide your profession to a full class of students in a public school, you can charge the school a premium.  '
                onInput={(e) =>
                  counter(e.target.value, e.target, set_motivation, 500)
                }
                spellcheck="true"
                style={{ width: "100%", padding: "10px", height: "160px" }}
                name=""
                id=""
              ></textarea>
              <div className="inputValidator">
                Your have reached the max limit of 500 characters.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Actions
        nextDisabled={!tutor.AcademyId}
        onEdit={handleEditClick}
        editDisabled={editMode}
        unSavedChanges={unSavedChanges}
        loading={savingRecord}
      />
    </form>
  );
};

export default TutorSetup;
