import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import EducationComp from "../../components/tutor/Education/Education";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../images/videos/education.mp4'

const Education = () => {
  return (
    <TutorLayout showLegacyFooter={false} >
      <TabInfoVideoToast video={VIDEO} />
      <EducationComp />
    </TutorLayout>
  );
};

export default Education;
