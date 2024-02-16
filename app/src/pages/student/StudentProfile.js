import StudentProfileCnt from "../../components/student/StudentProfile";
import StudentLayout from "../../layouts/StudentLayout";
import Actions from '../../components/common/Actions';

const StudentProfile = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            <StudentProfileCnt />
            <Actions saveDisabled />
        </StudentLayout>
    );
}

export default StudentProfile;