import { useSelector } from "react-redux";
import StudentShortList from "../../components/student/StudentShortList";
import StudentLayout from "../../layouts/StudentLayout";
import { generateUpcomingSessionMessage } from "../../helperFunctions/generalHelperFunctions";
import SmallSideBar from "../../components/common/SmallSideBar";

const StudentShortLists = () => {
    const { upcomingSessionFromNow, upcomingSession, sessions } = useSelector(state => state.studentSessions)
    console.log(upcomingSession, upcomingSessionFromNow, sessions)
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentShortList />
        </StudentLayout>
    );
}

export default StudentShortLists;