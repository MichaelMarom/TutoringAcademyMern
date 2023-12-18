import MyStudentsComp from "../../components/tutor/MyStudents";
import TutorLayout from "../../layouts/TutorLayout";

const MyStudents = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <MyStudentsComp />
    </TutorLayout>
  );
};

export default MyStudents;
