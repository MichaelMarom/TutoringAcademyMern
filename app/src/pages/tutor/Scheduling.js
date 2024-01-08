import Actions from "../../components/common/Actions";
import SchedulingComp from "../../components/tutor/Scheduling";
import TutorLayout from "../../layouts/TutorLayout";

const Scheduling = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <SchedulingComp />
      <Actions saveDisabled={true}
        editDisabled={true} />
    </TutorLayout>
  );
};

export default Scheduling;
