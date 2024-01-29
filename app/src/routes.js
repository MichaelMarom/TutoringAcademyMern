import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useRoutes } from "react-router-dom";

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
import { get_my_data, get_student_setup_by_userId } from "./axios/student";

import { setStudent } from "./redux/student_store/studentData";
import { setTutor } from "./redux/tutor_store/tutorData";
import { setChats } from "./redux/chat/chat";
import { socket } from "./config/socket";
import { moment } from './config/moment';
import TutorProfile from "./pages/tutor/TutorProfile";
import { useClerk, useSignIn, useSignUp, SignIn, SignUp, useAuth, useUser, SignedIn, SignedOut, RedirectToSignIn, useSession } from '@clerk/clerk-react';
import { get_user_detail } from "./axios/auth";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { getToken, isLoaded, isSignedIn, userId, actor, sessionId } = useAuth();
  const { user: signinUser } = useUser()
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state => state.student))
  const { tutor } = useSelector((state => state.tutor))

  const [activeRoutes, setActiveRoutes] = useState([]);
  const storedUser = localStorage.getItem("user");
  const studentUserId = localStorage.getItem('student_user_id')
  const tutorUserId = localStorage.getItem('tutor_user_id')
  const studentLoggedIn = user.role === 'student';
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const role = studentLoggedIn ? 'student' : 'tutor';
  const { shortlist, isLoading } = useSelector(state => state.shortlist)
  const nullValues = ['undefined', 'null'];

  useEffect(() => {
    if (userId) {
      const fetch = async () => {
        const data = await get_user_detail(userId);
        dispatch(setUser(data));
        localStorage.setItem('user', JSON.stringify(data));
        console.log(', data', data.SID && data.role === 'tutor')

        data.SID && data.role === 'tutor' && dispatch(setTutor())
        if (data.SID && data.role === 'student') {
          dispatch(setShortlist())
          console.log(', data', data)
          const result = await get_student_setup_by_userId(data.SID);
          dispatch(setStudent(result[0]))
          localStorage.setItem('student_user_id', result[0].AcademyId);
        }
      }
      fetch()
    }
  }, [userId])

  // useEffect(() => {
  //   if (user?.[0]?.role === "tutor")
  //     window.localStorage.setItem("tutor_tab_index", 0);

  //   if (user?.[0]?.role === "student")
  //     window.localStorage.setItem("student_tab_index", 0);
  // }, [user]);

  useEffect(() => {
    if (user && user.role !== 'admin')
      get_tutor_setup_by_userId(user.SID).then((result) => {
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

  const getStudentDetails = async () => {
    if (nullValues.includes(studentUserId)) {
      return dispatch(setStudent({}));
    }
    const res = await get_my_data(studentUserId)
    dispatch(setStudent(res[1][0][0]));
  }

  useEffect(() => {
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
    console.log('enterdede', role)

    if (role && rolePermissions[role]) {
      if (role === 'admin') {
        const allRoutes = Object.keys(rolePermissions).map((key) => rolePermissions[key]).flat();
        setActiveRoutes(
          allRoutes.map((route) => ({
            path: route.path,
            element: route.component,
          })))
      } else {
        console.log('enterdede', role)
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

  console.log(activeRoutes, student)

  useEffect(() => {
    generateRoutes(user?.role);
  }, [user])

  useEffect(() => {
    if (location.pathname === '/')
      navigate('/tutor/setup')
  }, [location, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(await getToken(), isLoaded, isSignedIn, userId, signinUser, actor);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const routes12 = (
    <>
      <SignedIn>
        {useRoutes([
          ...activeRoutes
        ])}
      </SignedIn>

      <SignedOut>
        {useRoutes([
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/signup',
            element: <Signup />,
          },
          {
            path: '*',
            element: <UnAuthorizeRoute />,
          },
        ])}
      </SignedOut>
    </>
  );

  const routes = useRoutes([
    {
      path: "/login",
      element: <SignedOut> <Login /></SignedOut>,
    },
    {
      path: "/signup",
      element: <SignedOut> <Signup /> </SignedOut>,
    },
    ...activeRoutes,
    {
      path: "*",
      element: <UnAuthorizeRoute />,
    },
  ]);
  console.log(activeRoutes)
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {activeRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<SignedIn>{route.element}</SignedIn>} />
      ))}
      <Route path="*" element={<UnAuthorizeRoute />} />
    </Routes>);
};

export default App;
