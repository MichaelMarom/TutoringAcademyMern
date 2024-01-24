import TutorCollabBoard from "../../components/tutor/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";
const TutorClass = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
    
      <TutorCollabHeader />
      <TutorCollabBoard />
      <TutorCollabFooter />

    </TutorLayout>
  );
};

export default TutorClass;
