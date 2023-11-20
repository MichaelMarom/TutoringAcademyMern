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

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const [activeRoutes, setActiveRoutes] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    dispatch(setUser(storedUser ? JSON.parse(storedUser) : {}));
  }, []);

  useEffect(() => {
    if (user[0] && user[0].role !== 'admin')
      get_tutor_setup_by_userId(user[0].SID).then((result) => {
        console.log(result[0], user[0].SID)
        localStorage.setItem("tutor_user_id", result[0]?.AcademyId);
      });
  }, [user]);

  useEffect(() => {
    dispatch(setShortlist())
  }, [localStorage.getItem('student_user_id')])


  useEffect(() => {
    if (user[0]?.role === "tutor")
      window.localStorage.setItem("tutor_tab_index", 0);

    if (user[0]?.role === "student")
      window.localStorage.setItem("student_tab_index", 0);
  }, [user]);

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
    generateRoutes(user[0]?.role);
  }, [user])

  useEffect(() => {
    if (location.pathname === '/')
      navigate('/login')
  }, [])

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
