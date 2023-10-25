import { Actions } from "../../components/student/Actions";
import Header from "../../components/student/Header";
import StudentAccounting from "../../components/student/StudentAccounting";
import StudentLayout from "../../layouts/StudentLayout";

const StudentAccountings = () => {
    return (
        <>
            {/* // <StudentLayout> */}
            <Header />
            <StudentAccounting />
            {/* // </StudentLayout> */}
        </>
    );
}

export default StudentAccountings;