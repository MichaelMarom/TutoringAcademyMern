import { useSelector } from "react-redux";
import SmallSideBar from "../../components/common/SmallSideBar";
import StudentSetupComp from "../../components/student/StudentSetup";
import StudentLayout from "../../layouts/StudentLayout";
import { generateUpcomingSessionMessage } from "../../helperFunctions/generalHelperFunctions";


const StudentSetup = () => {

    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentSetupComp />
        </StudentLayout>
    );
}

export default StudentSetup;