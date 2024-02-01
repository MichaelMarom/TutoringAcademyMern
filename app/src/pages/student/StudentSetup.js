import StudentSetupComp from "../../components/student/StudentSetup";
import StudentLayout from "../../layouts/StudentLayout";


const StudentSetup = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentSetupComp />
        </StudentLayout>
    );
}

export default StudentSetup;