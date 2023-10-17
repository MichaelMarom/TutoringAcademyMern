import TutorCollaboration from "../pages/tutor/Collaboration";

import Intro from "../pages/tutor/Intro";
import TutorSetup from "../pages/tutor/TutorSetup";
import Education from "../pages/tutor/Education";
import Rates from "../pages/tutor/Rates";
import Accounting from "../pages/tutor/Accounting";
import Subjects from "../pages/tutor/Subjects";
import MyStudents from "../pages/tutor/MyStudents";
import Scheduling from "../pages/tutor/Scheduling";
import TermOfUse from "../pages/tutor/TermOfUse";
import MarketPlace from "../pages/tutor/MarketPlace";
import TutorProfile from "../pages/tutor/TutorProfile";

import StudentCollaboration from "../pages/student/Collaboration";


import StudentSetup from "../pages/student/StudentSetup";
import StudentFaculty from "../pages/student/StudentFaculty";
import StudentShortLists from "../pages/student/StudentShortList";
import StudentAccountings from "../pages/student/StudentAccounting";
import Tutor_Table from "../pages/Admin/Tutor";
import Student_Table from "../pages/Admin/Student";
import StudentScheduling from "../pages/student/StudentScheduling";
import StudentTermOfUse from "../pages/student/TermOfUse";
import StudentMarketPlace from "../components/student/StudentMarketPlace";
import TutorNewSubject from "../pages/Admin/NewSubject";
import StudentProfile from "../pages/student/StudentProfile";
import StudentIntro from "../pages/student/StudentIntro";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import TutorClass from "../pages/tutor/TutotClass";

const rolePermissions = {
    tutor: [
        { path: '/tutor/intro', component: <Intro /> },
        { path: '/tutor/setup', component: <TutorSetup /> },
        { path: '/tutor/education', component: <Education /> },
        { path: '/tutor/rates', component: <Rates /> },
        { path: '/tutor/accounting', component: <Accounting /> },
        { path: '/tutor/subjects', component: <Subjects /> },
        { path: '/tutor/my-students', component: <MyStudents /> },
        { path: '/tutor/scheduling', component: <Scheduling /> },
        { path: '/tutor/term-of-use', component: <TermOfUse /> },
        { path: '/tutor/market-place', component: <MarketPlace /> },
        { path: '/tutor/tutor-profile', component: <TutorProfile /> },
        { path: '/profile', component: <Profile /> },
        { path: "tutor/collaboration", component: <TutorClass /> }
    ],
    student: [
        { path: "student/collaboration", component: <StudentCollaboration /> },
        { path: '/profile', component: <Profile /> },
        { path: "student/", component: <StudentSetup /> },
        { path: "student/intro", component: <StudentIntro /> },
        { path: "student/setup", component: <StudentSetup /> },
        { path: "student/faculties", component: <StudentFaculty /> },
        { path: "student/short-list", component: <StudentShortLists /> },
        { path: "student/accounting", component: <StudentAccountings /> },
        { path: "student/market-place", component: <StudentMarketPlace /> },
        { path: "student/schedule", component: <StudentScheduling /> },
        { path: "student/term-of-use", component: <StudentTermOfUse /> },
        { path: "student/profile", component: <StudentProfile /> },
    ],
    admin: [
        { path: '/profile', component: <Profile /> },

        { path: "admin/tutor-data", component: <Tutor_Table /> },
        { path: "admin/student-data", component: <Student_Table /> },
        { path: "admin/new-subject", component: <TutorNewSubject /> },
    ],
    common: [
        { path: '/login', component: <Login /> },
        { path: '/signup', component: <Signup /> },
    ]
};

export const isAllowed = (role, route) => rolePermissions[role].includes(route);

export default rolePermissions;
