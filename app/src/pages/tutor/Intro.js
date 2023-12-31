import Intro from "../../components/tutor/Intro";
import TutorLayout from "../../layouts/TutorLayout";


const TutorIntro = () => {
    return (
        <TutorLayout showLegacyFooter={false}>
            <Intro />
        </TutorLayout>
    );
}

export default TutorIntro;