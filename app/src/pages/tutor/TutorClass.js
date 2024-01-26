import TutorCollabBoard from "../../components/tutor/TutorCollabBoard";
import TutorCollabFooter from "../../components/tutor/TutorCollabFooter";
import TutorCollabHeader from "../../components/tutor/TutorCollabHeader";
import TutorLayout from "../../layouts/TutorLayout";
import { Tldraw } from '@tldraw/tldraw'

const TutorClass = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <div style={{ position: 'fixed', inset: 0, marginTop:"20px" }}>
        <Tldraw />
      </div>
    </TutorLayout>
  );
};
// <TutorCollabFooter />

export default TutorClass;
