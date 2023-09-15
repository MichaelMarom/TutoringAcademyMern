import { Route, Link, useLocation, Routes, useNavigate } from "react-router-dom";
import{motion,AnimatePresence} from 'framer-motion';

import './styles/Tab_Styles/LargeScreen.css';
import './styles/Collaboration_Styles/LargeScreen.css';


import TutorCollaboration from "./pages/tutor/Collaboration";
import StudentCollaboration from "./pages/student/Collaboration";

import Intro from "./commponents/tutor/Intro";
import TutorSetup from "./commponents/tutor/TutorSetup";
import Education from "./commponents/tutor/Education";
import Rates  from "./commponents/tutor/Rates";
import Accounting from "./commponents/tutor/Accounting";
import Subjects from "./commponents/tutor/Subjects";
import MyStudents from "./commponents/tutor/MyStudents";
import Scheduling from "./commponents/tutor/Scheduling";
import TermOfUse from "./commponents/tutor/TermOfUse";
import MarketPlace from "./commponents/tutor/MarketPlace";
import TutorProfile from "./commponents/tutor/TutorProfile";

import TutorHeader from "./commponents/tutor/Header";
import StudentHeader from "./commponents/student/Header";

import StudentSetup from "./pages/student/StudentSetup";
import { useEffect, useState } from "react";
import StudentFaculty from "./pages/student/StudentFaculty";
import StudentShortLists from "./pages/student/StudentShortList";
import StudentAccountings from "./pages/student/StudentAccounting";
import StudentFooter from "./commponents/student/Footer";
import Footer from "./commponents/tutor/Footer";
import Header from "./commponents/admin/AdminHeader";
import Tutor_Table from "./pages/Admin/Tutor";
import Student_Table from "./pages/Admin/Student";


const App = () => {

    let location = useLocation();
    let navigate = useNavigate();

    let [role, setRole] = useState(false)

    useEffect(() => {
        if(location.pathname.split('/').splice(-2)[0] === 'tutor'){
            setRole('tutor')
        }else if(location.pathname.split('/').splice(-2)[0] === 'student'){
            setRole('student')
        }else{
            setRole('admin')
        }
    }, [location]);

    useEffect(() => {
        if(location.pathname.split('/').splice(-2)[0] === 'tutor'){
            navigate('tutor/intro')
            window.localStorage.setItem('tutor_tab_index', 0)
        }else if(location.pathname.split('/').splice(-2)[0] === 'student'){
            navigate('student/intro')
            window.localStorage.setItem('student_tab_index', 0)
        }else{
            navigate('admin/tutor-data')
        }
    }, [])
    
    return ( 

        <AnimatePresence >


            {
                role === 'tutor'
                ?
                <>
                    <TutorHeader />
                        <Routes location={location} key={location.key}>
                            {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
                            <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
                            <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}
                            <Route path="tutor/intro" element={<Intro />}></Route>
                            <Route path="tutor/setup" element={<TutorSetup />}></Route>
                            <Route path="tutor/education" element={<Education />}></Route>
                            <Route path="tutor/rates" element={<Rates />}></Route>
                            <Route path="tutor/accounting" element={<Accounting />}></Route>
                            <Route path="tutor/subjects" element={<Subjects />}></Route>
                            <Route path="tutor/my-students" element={<MyStudents />}></Route>
                            <Route path="tutor/scheduling" element={<Scheduling />}></Route>
                            <Route path="tutor/term-of-use" element={<TermOfUse />}></Route>
                            <Route path="tutor/market-place" element={<MarketPlace />}></Route>
                            <Route path="tutor/collaboration" element={<TutorCollaboration />}></Route>
                            <Route path="tutor/tutor-profile" element={<TutorProfile />}></Route>

                        </Routes>
                    <Footer />
                </>

                :

                role === 'student'
                ?

                <>
                    <StudentHeader />
                    <Routes location={location} key={location.key}> 
                        {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
                        <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
                        <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}

                        <Route path="student/" element={< StudentSetup/>}></Route>
                        <Route path="student/setup" element={< StudentSetup/>}></Route>
                        <Route path="student/faculties" element={< StudentFaculty/>}></Route>
                        <Route path="student/short-list" element={< StudentShortLists/>}></Route>
                        <Route path="student/accounting" element={< StudentAccountings />}></Route>
                        <Route path="student/collaboration" element={<StudentCollaboration />}></Route>


                    </Routes>
                    <StudentFooter />
                </>

                :

                 <>
                    <Header />
                    <Routes location={location} key={location.key}> 
                        {/*<Route path="/Class/:role/:id" element={<Class />}></Route>
                        <Route path="/student-lecture-pane" element={<StudentLecturePanel />}></Route>
                        <Route path="/tutor-lecture-pane" element={<TutorLecturePanel />}></Route>*/}

                        
                        <Route path="admin/tutor-data" element={<Tutor_Table />}></Route>
                        <Route path="admin/student-data" element={<Student_Table />}></Route>


                    </Routes>
                </>
            }

            
            
        </AnimatePresence>
     );
}
 
export default App;