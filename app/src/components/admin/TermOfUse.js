import { useEffect, useState } from "react";
import RichTextEditor from "../common/RichTextEditor/RichTextEditor";
import Actions from "../common/Actions";
import { get_adminConstants, post_termsOfUse } from "../../axios/admin";

const TermOfUse = () => {
    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next?.removeAttribute('id');
        }
    }, [])
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    const [terms, set_terms] = useState('');
    const [db_terms, set_db_terms] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editMode, setEditMode] = useState(false);
    const tutorId = localStorage.getItem('tutor_user_id');
    const [agreed, set_agreed] = useState(false);
    useEffect( () => {
        const fetchData =async()=>{
            try {
                
                const storedUserRole = localStorage.getItem('user_role');
                // const storedUserRole = 'notadmin';
                const result = await get_adminConstants();
                set_terms(result.data[0].TermContent);
                set_db_terms(result.data[0].TermContent);
                setUserRole(storedUserRole);
            } catch (error) {
                console.error('Error fetching data:', error);
                
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (terms !== db_terms) {
            setUnsavedChanges(true);
        } else setUnsavedChanges(false)
        
    }, [terms])
    const handleEditorChange = (value) => {
        set_terms(value);
    };
    const handleEditClick = () => {
        setEditMode(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();

        const response = await post_termsOfUse({ TermContent: terms });
        console.log(response.data);
        setEditMode(false);
    };
    return (

        <>
            <div className="form-term-of-use">
                <form action='' onSubmit={handleSave}>
                    <div className='px-4'>
                        <RichTextEditor
                            value={terms}
                            onChange={handleEditorChange}
                            readOnly={!editMode}
                            placeholder="Enter Your Work Experience"
                        // required
                        />
                    </div>
                    <Actions
                        saveDisabled={!userRole || userRole !== 'admin'} // Disable save if user role is not admin
                        editDisabled={!userRole || userRole !== 'admin'} // Disable edit if user role is not admin
                        onEdit={handleEditClick}
                        unSavedChanges={unSavedChanges}
                    />
                </form>
<div className="d-none">
                <div className="term-of-use-cnt">
                    TUTORING ACADEMY TERMS OF USE.
                    CHECKING THE BOX BELOW, CONSTITUTES YOUR ACCEPTANCE OF THIS TERMS OF USE;
                    1.  Eligibility: The tutor must be at least 18 years old and have a valid government-issued ID.
                    2. Background check: The tutor must undergo a background check before joining the academy.
                    3. Qualifications: The tutor must have the necessary qualifications and experience to teach the subject(s) they are applying for.

                    4. Code of conduct: I. The tutor must agree to abide by the academy’s code of conduct, which includes but is not limited to:
                    II. Maintaining a professional demeanor at all times.
                    III.Not engaging in any inappropriate behavior or communication with the students.
                    IV. Not sharing any personal information with the students.
                    V. Not discriminating against any student based on their race, gender, religion, or any other characteristic.
                    VI. Confidentiality: The tutor must agree to maintain the confidentiality of the students’ personal information and academic records.
                    VII. Payment: The tutor will be paid a fixed hourly rate for their services.
                    VIII. Termination: The academy reserves the right to terminate the tutor’s contract at any time if they violate any of the terms of use.

                    Tutoring Academy maintains copyrights protection in all matrials within the website "www.tutoring-academy.com". The academy consents to downloading, copying,
                    and distribution for the materials for non comercial purposes. You are not allowed.....................
                </div>

                <div className="agreement" style={{ display: 'block', position: 'relative', padding: '45px' }}>


                    <div style={{ display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap' }}>
                        <input type="checkbox" id="e-level" style={{ float: 'left' }} />

                        <span style={{ margin: ' 0 10px 15px 10px' }} htmlFor="e-level">By selecting this box i have agreed to the terms and conditions of use</span>
                    </div>

                    <div style={{ display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap' }}>
                        <input type="checkbox" id="e-level" style={{ float: 'left' }} />

                        <span style={{ margin: ' 0 10px 15px 10px' }} htmlFor="e-level">I will provide my social security number when my account accummulates $50 (For American Citizens Only)</span>
                    </div>

                    <div style={{ display: 'flex', margin: '0 0 5px 0', width: '300px', whiteSpace: 'nowrap' }}>
                        <input type="checkbox" id="e-level" style={{ float: 'left' }} />

                        <span style={{ margin: ' 0 10px 15px 10px' }} htmlFor="e-level">Tutoring academy will issue me IRS form 1099 when my account will exceed $600 (For American Citizens Only)</span>
                    </div>

                </div>

            </div>
            </div>
        </>
    );
}

export default TermOfUse;