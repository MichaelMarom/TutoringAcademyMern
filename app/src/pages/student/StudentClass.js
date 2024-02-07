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
            <div className="d-flex" style={{ gap: "2%" }}>
                <div style={{ position: 'fixed', inset: 0, marginTop: "100px", width: "80%" }}>
                    <Excalidraw />
                </div>

                <div className="bg-light rounded" style={{ width: "28%" }}>
                    <StudentCollabBoard />
                </div>
            </div >
        </StudentLayout>
    );
}

export default StudentClass;