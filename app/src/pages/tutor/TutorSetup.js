import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import Setup from "../../components/tutor/TutorSetup";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../images/videos/setup.mp4'

const TutorSetup = () => {
    return (
        <TutorLayout showLegacyFooter={false}>
            <TabInfoVideoToast video={VIDEO} />
            <Setup />
        </TutorLayout>
    );
}

export default TutorSetup;