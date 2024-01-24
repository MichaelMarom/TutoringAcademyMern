import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import React from "react";

import "./styles/Tab_Styles/LargeScreen.css";
import "./styles/student.css";
import "./styles/admin.css";
import "./styles/collab.css";
import "./styles/Collaboration_Styles/LargeScreen.css";
import { setUser } from "./redux/auth_state/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import rolePermissions from "./utils/permissions";
import UnAuthorizeRoute from "./utils/UnAuthorizeRoute";
import { get_tutor_setup_by_userId } from "./axios/tutor";
import { setShortlist } from "./redux/student_store/shortlist";
import { get_my_data } from "./axios/student";

import { setStudent } from "./redux/student_store/studentData";
import { setTutor } from "./redux/tutor_store/tutorData";
import { setChats } from "./redux/chat/chat";
import { socket } from "./config/socket";
import { moment } from './config/moment';
import TutorProfile from "./pages/tutor/TutorProfile";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state => state.student))
  const { tutor } = useSelector((state => state.tutor))

  const [activeRoutes, setActiveRoutes] = useState([]);
  const storedUser = localStorage.getItem("user");
  const studentUserId = localStorage.getItem('student_user_id')
  const tutorUserId = localStorage.getItem('tutor_user_id')
  const studentLoggedIn = location.pathname.split('/')[1] === 'student';
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const role = studentLoggedIn ? 'student' : 'tutor';
  const { shortlist, isLoading } = useSelector(state => state.shortlist)
  const nullValues = ['undefined', 'null']


  //ids
  useEffect(() => {
    dispatch(setUser(storedUser ? JSON.parse(storedUser) : {}));
  }, [dispatch, storedUser]);

  useEffect(() => {
    if (user?.[0]?.role === "tutor")
      window.localStorage.setItem("tutor_tab_index", 0);

    if (user?.[0]?.role === "student")
      window.localStorage.setItem("student_tab_index", 0);
  }, [user]);

  useEffect(() => {
    if (user?.[0] && user?.[0].role !== 'admin')
      get_tutor_setup_by_userId(user?.[0].SID).then((result) => {
        localStorage.setItem("tutor_user_id", result[0]?.AcademyId || null);
      });
  }, [user]);

  //dispatch

  useEffect(() => {
    if (studentLoggedIn) {
      moment.tz.setDefault(student.timeZone);
    }
    else {
      moment.tz.setDefault(tutor.timeZone);
    }
  }, [tutor, student])
  console.log(typeof (studentUserId), 'typeof studentuserId', studentUserId)
  useEffect(() => {
    dispatch(setShortlist())
    const getStudentDetails = async () => {
      if (nullValues.includes(studentUserId)) {
        return dispatch(setStudent({}));
      }
      const res = await get_my_data(studentUserId)
      dispatch(setStudent(res[1][0][0]));
    }
    getStudentDetails()
  }, [dispatch, studentUserId])

  useEffect(() => {
    dispatch(setTutor())
  }, [dispatch, tutorUserId])

  useEffect(() => {
    const fetchData = () => {
      if (loggedInUserDetail.AcademyId) {
        dispatch(setChats(loggedInUserDetail.AcademyId, role));
      }
    };

    fetchData();

  }, [dispatch, loggedInUserDetail.AcademyId, role])

  //chat
  useEffect(() => {
    if (socket) {
      socket.on("online", (id) => {
        // dispatch(setShortlist())
        // console.log(shortlist)
        // const updatedArray = shortlist.map((item) => {
        //   if (item?.tutorData?.AcademyId === id) {
        //     // If the condition is met, update the online property to true
        //     return { ...item, tutorData: { ...item.tutorData, Online: true } };
        //   }
        //   return item;
        // });
        // !isLoading && dispatch(setShortlistAction(updatedArray))
        console.log('id is online', id)
      })
      socket.on("offline", (id) => {
        // console.log(shortlist)
        // const updatedArray = shortlist.map((item) => {
        //   if (item?.tutorData?.AcademyId === id) {
        //     // If the condition is met, update the online property to true
        //     return { ...item, tutorData: { ...item.tutorData, Online: false } };
        //   }
        //   return item;
        // });
        // !isLoading && dispatch(setShortlistAction(updatedArray))
        console.log('id is offline', id)
      })
    }
  }, [dispatch, isLoading]);

  //routes
  const generateRoutes = (role) => {
    if (role && rolePermissions[role]) {
      if (role === 'admin') {
        const allRoutes = Object.keys(rolePermissions).map((key) => rolePermissions[key]).flat();
        setActiveRoutes(
          allRoutes.map((route) => ({
            path: route.path,
            element: route.component,
          })))
      } else {
        setActiveRoutes(
          rolePermissions[role].map((route) => ({
            path: route.path,
            element: route.component,
          })))
      }
    }
    else {
      setActiveRoutes([]);
    }
  };

  useEffect(() => {
    generateRoutes(user?.[0]?.role);
  }, [user])

  useEffect(() => {
    if (location.pathname === '/')
      navigate('/login')
  }, [location, navigate])

  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    ...activeRoutes,
    {
      path: "*",
      element: <UnAuthorizeRoute />,
    },
  ]);

  return routes;
};

export default App;
