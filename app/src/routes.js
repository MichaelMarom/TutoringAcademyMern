import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

import React from 'react'

import './styles/Tab_Styles/LargeScreen.css';
import './styles/student.css';
import './styles/admin.css';
import './styles/Collaboration_Styles/LargeScreen.css'
import { setUser } from './redux/auth_state/auth';
import { loggedInAdmin, loggedInStudent, loggedInTutor } from "./constants/constants";
import { isAllowed } from "./utils/permissions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import rolePermissions from './utils/permissions';
import UnAuthorizeRoute from "./utils/UnAuthorizeRoute";


const App = () => {

    let location = useLocation();
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.user)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        dispatch(setUser(storedUser ? JSON.parse(storedUser) : {}));
    }, []);

    useEffect(() => {
        localStorage.setItem('tutor_user_id', user.AcademyId)
    }, [user])

    console.log(user)
    
    const getDefaultRoute = (role) => {
        const defaultRoutes = {
            tutor: '/tutor/intro',
            student: '/student/intro',
            admin: '/admin/tutor-data',
        };


        return defaultRoutes[role] || '/login';
    };

    useEffect(() => {
        if (user?.role === 'tutor') window.localStorage.setItem('tutor_tab_index', 0)

        if (user?.role === 'student') window.localStorage.setItem('student_tab_index', 0)
    }, [user])

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
            path: '/login',
            element: <Login />,
        },
        {
            path: '/signup',
            element: <Signup />,
        },
        ...generateRoutes(user[0]?.role),
        {
            path: '*',
            element: <UnAuthorizeRoute />,
        },
    ]);


    return routes;
    // return (
    //     <AnimatePresence >
    //         {
    //             role === 'tutor'
    //                 ?
    //                 <>
    //                     <TutorHeader />
    //                     <Routes location={location} key={location.key}>
    //                         {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
    //                         <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
    //                         <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}
    //                         <Route path="/intro" element={<Intro />}></Route>
    //                         <Route path="tutor/setup" element={<TutorSetup />}></Route>
    //                         <Route path="tutor/education" element={<Education />}></Route>
    //                         <Route path="tutor/rates" element={<Rates />}></Route>
    //                         <Route path="tutor/accounting" element={<Accounting />}></Route>
    //                         <Route path="tutor/subjects" element={<Subjects />}></Route>
    //                         <Route path="tutor/my-students" element={<MyStudents />}></Route>
    //                         <Route path="tutor/scheduling" element={<Scheduling />}></Route>
    //                         <Route path="tutor/term-of-use" element={<TermOfUse />}></Route>
    //                         <Route path="tutor/market-place" element={<MarketPlace />}></Route>
    //                         <Route path="tutor/collaboration" element={<TutorCollaboration />}></Route>
    //                         <Route path="tutor/tutor-profile" element={<TutorProfile />}></Route>

    //                     </Routes>
    //                     <Footer />
    //                 </>

    //                 :

    //                 role === 'student'
    //                     ?

    //                     <>
    //                         <StudentHeader />
    //                         <Routes location={location} key={location.key}>
    //                             {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
    //                     <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
    //                     <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}

    //                             <Route path="student/" element={< StudentSetup />}></Route>
    //                             <Route path="student/setup" element={< StudentSetup />}></Route>
    //                             <Route path="student/faculties" element={< StudentFaculty />}></Route>
    //                             <Route path="student/short-list" element={< StudentShortLists />}></Route>
    //                             <Route path="student/accounting" element={< StudentAccountings />}></Route>
    //                             <Route path="student/collaboration" element={<StudentCollaboration />}></Route>
    //                             <Route path="student/market-place" element={<StudentMarketPlace />}></Route>
    //                             <Route path="student/schedule" element={<StudentScheduling />}></Route>
    //                             <Route path="student/term-of-use" element={<StudentTermOfUse />}></Route>
    //                             <Route path="student/profile" element={<StudentProfile />}></Route>


    //                         </Routes>
    //                         <StudentFooter />
    //                     </>

    //                     :
    //                     role === 'admin' ?
    //                         <>
    //                             <Header />
    //                             <Routes location={location} key={location.key}>
    //                                 {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
    //                     <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
    //                     <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}


    //                                 <Route path="admin/tutor-data" element={<Tutor_Table />}></Route>
    //                                 <Route path="admin/student-data" element={<Student_Table />}></Route>
    //                                 <Route path="admin/new-subject" element={<TutorNewSubject />}></Route>


    //                             </Routes>
    //                         </>

    //                         :
    //                         <>
    //                             <Header />
    //                             <Routes location={location} key={location.key}>
    //                                 <Route path="/login" element={<Tutor_Table />}></Route>
    //                                 <Route path="/signup" element={<Student_Table />}></Route>

    //                             </Routes>
    //                         </>

    //         }



    //     </AnimatePresence>
    // );
}

export default App;