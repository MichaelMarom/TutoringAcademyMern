import { Excalidraw } from "@excalidraw/excalidraw";
import Actions from "../../components/common/Actions";
import StudentCollabBoard from "../../components/student/StudentCollabBoard";
import StudentCollabFooter from "../../components/student/StudentCollabFooter";
import StudentCollabHeader from "../../components/student/StudentCollabHeader";
import StudentLayout from "../../layouts/StudentLayout";
import Countdown from "react-countdown";

const StudentClass = () => {
    return (
        <StudentLayout showLegacyFooter={false}>
            {/* <StudentCollabHeader />
            <StudentCollabBoard />
            <StudentCollabFooter /> */}

            <div style={{ position: 'fixed', inset: 0, marginTop: "100px" }}>
                <div>
                    <Countdown date={Date.now() + 1000 * 60}>
                        <div>Session Ended!</div>
                    </Countdown>

                </div>
                <Excalidraw />
            </div>
            <Actions saveDisabled />
        </StudentLayout>
    );
}

export default StudentClass;