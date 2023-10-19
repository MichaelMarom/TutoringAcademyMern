import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import React from "react";

import "./styles/Tab_Styles/LargeScreen.css";
import "./styles/student.css";
import "./styles/admin.css";
import "./styles/Collaboration_Styles/LargeScreen.css";
import { setUser } from "./redux/auth_state/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import rolePermissions from "./utils/permissions";
import UnAuthorizeRoute from "./utils/UnAuthorizeRoute";
import { get_tutor_setup_by_userId } from "./axios/tutor";

const App = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    dispatch(setUser(storedUser ? JSON.parse(storedUser) : {}));
  }, []);

  useEffect(() => {
    if (user[0])
      get_tutor_setup_by_userId(user[0].SID).then((result) => {
        console.log(result, "render in routes");
        localStorage.setItem("tutor_user_id", result[0].AcademyId);
      });
  }, [user]);

  console.log(user);

  const getDefaultRoute = (role) => {
    const defaultRoutes = {
      tutor: "/tutor/intro",
      student: "/student/intro",
      admin: "/admin/tutor-data",
    };

    return defaultRoutes[role] || "/login";
  };

  useEffect(() => {
    if (user?.role === "tutor")
      window.localStorage.setItem("tutor_tab_index", 0);

    if (user?.role === "student")
      window.localStorage.setItem("student_tab_index", 0);
  }, [user]);

  const generateRoutes = (role) => {
    if (role && rolePermissions[role]) {
      return rolePermissions[role].map((route) => ({
        path: route.path,
        element: route.component,
      }));
    }
    return [];
  };

  const routes = useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    ...generateRoutes(user[0]?.role),
    {
      path: "*",
      element: <UnAuthorizeRoute />,
    },
  ]);

  return routes;
};

export default App;
