import StudentAside from "./StudentCollabAside";

const StudentCollabBoard = () => {
    return ( 
        <>
            <div className="StudentCollabBoard">


                <StudentAside />

                <canvas id="drawPlace" style={{border:'1px solid #eee'}}>
            
                </canvas>
            </div>
        </>
     );
}
 
export default StudentCollabBoard;