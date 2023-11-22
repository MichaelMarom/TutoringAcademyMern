import StudentShortList from "../../components/student/StudentShortList";
import StudentLayout from "../../layouts/StudentLayout";

const StudentShortLists = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentShortList />
        </StudentLayout>
    );
}

export default StudentShortLists;