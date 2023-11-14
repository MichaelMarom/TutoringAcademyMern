import StudentFaculties from "../../components/student/StudentFaculties";
import StudentLayout from "../../layouts/StudentLayout";


const StudentFaculty = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentFaculties />
        </StudentLayout>
    );
}

export default StudentFaculty;