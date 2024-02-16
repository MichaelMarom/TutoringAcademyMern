import StudentAccounting from "../../components/student/Accounting/StudentAccounting";
import StudentLayout from "../../layouts/StudentLayout";

const StudentAccountings = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentAccounting />
        </StudentLayout>
    );
}

export default StudentAccountings;