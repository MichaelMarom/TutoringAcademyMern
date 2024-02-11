import Actions from "../../components/common/Actions";
import TabInfoVideoToast from "../../components/common/TabInfoVideoToast";
import SchedulingComp from "../../components/tutor/Scheduling";
import TutorLayout from "../../layouts/TutorLayout";
import VIDEO from '../../images/videos/calender.mp4'

const Scheduling = () => {
  return (
    <TutorLayout showLegacyFooter={false}>
      <TabInfoVideoToast video={VIDEO} />
      <SchedulingComp />
      <Actions saveDisabled={true}
        editDisabled={true} />
    </TutorLayout>
  );
};

export default Scheduling;
