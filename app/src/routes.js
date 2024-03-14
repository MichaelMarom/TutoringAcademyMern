import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { isExpired, decodeToken } from 'react-jwt'

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
import { moment } from './config/moment';
import {
  useClerk, useAuth, useUser,
  SignedIn
} from '@clerk/clerk-react';
import { get_user_detail } from "./axios/auth";
import { redirect_to_login } from "./helperFunctions/auth";
import { setStudentSessions } from "./redux/student_store/studentSessions";
import { setTutorSessions } from "./redux/tutor_store/tutorSessions";
import TutorClass from "./pages/tutor/TutorClass";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('access_token')
  const { userId, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useSelector((state) => state.user);
  const { student } = useSelector((state => state.student))
  const { tutor } = useSelector((state => state.tutor))

  const [activeRoutes, setActiveRoutes] = useState([]);
  const storedUser = localStorage.getItem("user");
  const studentUserId = localStorage.getItem('student_user_id')
  const tutorUserId = localStorage.getItem('tutor_user_id')
  const studentLoggedIn = user?.role === 'student';
  const loggedInUserDetail = studentLoggedIn ? student : tutor;
  const role = studentLoggedIn ? 'student' : 'tutor';
  const { shortlist, isLoading } = useSelector(state => state.shortlist)
  const nullValues = ['undefined', 'null'];

  const screen = location.pathname.split('/')[1]
  const handleExpiredToken = (result) => {
    if (result?.response?.data?.message?.includes('expired') ||
      result?.response?.data?.message?.includes('malformed')) {
      return redirect_to_login(navigate, signOut)
    }
  }

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetch = async () => {
        const data = await get_user_detail(userId);
        if (data?.response?.data?.message?.includes('expired') ||
          data?.response?.data?.message?.includes('malformed')) {
          return redirect_to_login(navigate, signOut)
        }
        dispatch(setUser(data));
        localStorage.setItem('user', JSON.stringify(data));

        data.SID && data.role === 'tutor' && dispatch(setTutor())
        if (data.SID && (data.role === 'student' || screen === 'student')) {
          dispatch(setShortlist())
          if (data.role === 'student') {
            const result = await get_student_setup_by_userId(data.SID);
            if (result?.[0]) {
              dispatch(setStudent(result[0]))
              localStorage.setItem('student_user_id', result[0].AcademyId);
            }
          }
        }
      }
      fetch()
    }
  }, [userId, token, isSignedIn])

  useEffect(() => {
    if (user && user.role !== 'admin' && user.SID && isSignedIn)
      get_tutor_setup_by_userId(user.SID).then((result) => {
        handleExpiredToken(result);

        localStorage.setItem("tutor_user_id", result[0]?.AcademyId || null);
      });
  }, [user, isSignedIn]);

  //dispatch

  useEffect(() => {
    if (studentLoggedIn && userId && isSignedIn) {
      moment.tz.setDefault(student.timeZone);
    }
    else {
      moment.tz.setDefault(tutor.timeZone);
    }
  }, [tutor, student, userId, isSignedIn])


  //sessons
  useEffect(() => {
    student.AcademyId && dispatch(setStudentSessions(student))
    tutor.AcademyId && dispatch(setTutorSessions(tutor))
  }, [student, tutor])

  const getStudentDetails = async () => {
    if (nullValues.includes(studentUserId)) {
      return dispatch(setStudent({}));
    }
    const res = await get_my_data(studentUserId)
    if (res?.response?.data?.message?.includes('expired')) return redirect_to_login(navigate, signOut)
    dispatch(setStudent(res[1][0][0]));
  }

  useEffect(() => {
    if (userId && token && isSignedIn) getStudentDetails()
  }, [dispatch, studentUserId, userId, isSignedIn, token])

  useEffect(() => {
    if (userId && token && isSignedIn) dispatch(setTutor())
  }, [dispatch, tutorUserId, userId, isSignedIn, token])

  useEffect(() => {
    if (userId && token && isSignedIn) {
      const fetchData = () => {
        if (loggedInUserDetail.AcademyId) {
          dispatch(setChats(loggedInUserDetail.AcademyId, role));
        }
      };

      fetchData();
    }

  }, [dispatch, loggedInUserDetail.AcademyId, role, userId, isSignedIn, token])

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
    generateRoutes(user?.role);
  }, [user])

  useEffect(() => {
    if (location.pathname === '/')
      navigate('/tutor/setup')
  }, [location, navigate])


  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      console.log(isExpired(localStorage.getItem("access_token")))
      if (isExpired(localStorage.getItem("access_token"))) {
        navigate('/login')
        localStorage.clear()
      }
    }
    else { navigate('/login') }
  }, [])
  return (
    <Routes>
      <Route path="/collab/:id" element={<TutorClass />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {activeRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<SignedIn>{route.element}</SignedIn>} />
      ))}
      <Route path="*" element={<UnAuthorizeRoute />} />
    </Routes>
  );
};

export default App;
