import TutorProfileComp from "../../components/tutor/TutorProfile";
import TutorLayout from "../../layouts/TutorLayout";

const TutorProfile = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <TutorProfileComp />
    </TutorLayout>
  );
};

export default TutorProfile;
