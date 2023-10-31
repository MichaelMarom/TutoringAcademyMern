import StudentCollabBoard from "../../components/student/StudentCollabBoard";
import StudentCollabFooter from "../../components/student/StudentCollabFooter";
import StudentCollabHeader from "../../components/student/StudentCollabHeader";
import StudentLayout from "../../layouts/StudentLayout";

const StudentClass = () => {
    return (
        <StudentLayout>
            <StudentCollabHeader />
            <StudentCollabBoard />
            <StudentCollabFooter />
        </StudentLayout>
    );
}

export default StudentClass;