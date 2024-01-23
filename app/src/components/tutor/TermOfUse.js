import { useEffect, useState } from "react";
import RichTextEditor from "../common/RichTextEditor/RichTextEditor";
import Actions from "../common/Actions";
import { get_adminConstants, post_termsOfUse } from "../../axios/admin";
import Loading from "../common/Loading";
import { setTutor } from "../../redux/tutor_store/tutorData";
import { post_tutor_setup, setAgreementDateToNullForAll } from "../../axios/tutor";
import { useDispatch, useSelector } from "react-redux";
import { showDate } from "../../helperFunctions/timeHelperFunctions";
import { convertToDate } from "../common/Calendar/Calendar";

const TermOfUse = () => {
    const [unSavedChanges, setUnSavedChanges] = useState(false);
    const [terms, set_terms] = useState('');
    const [db_terms, set_db_terms] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true)
    const [agreed, setAgreed] = useState(false)
    const { tutor } = useSelector(state => state.tutor)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserRole = localStorage.getItem('user_role');
                const result = await get_adminConstants();
                set_terms(result.data[0].TermContent);
                set_db_terms(result.data[0].TermContent);
                setUserRole(storedUserRole);
            } catch (error) {
                console.error('Error fetching data:', error);

            }
            setFetching(false)

        }
        fetchData();
    }, []);

    useEffect(() => {
        if (tutor.AgreementDate)
            setAgreed(true)
    }, [tutor])

    useEffect(() => {
        if ((terms !== undefined && db_terms !== undefined && terms !== db_terms) ||
            (!tutor.AgreementDate && agreed)) {
            setUnSavedChanges(true);
        } else {
            setUnSavedChanges(false);
        }
    }, [terms, db_terms, agreed, tutor])

    const handleEditorChange = (value) => {
        set_terms(value);
    };

    const handleSaveTerms = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await post_termsOfUse({ TermContent: terms });
        await setAgreementDateToNullForAll()
        set_db_terms(response.data.TermContent);
        setEditMode(false);
        setLoading(false)
    };

    const handleSaveAgreement = async (e) => {
        e.preventDefault()
        setLoading(true)

        await post_tutor_setup({
            userId: tutor.userId, AgreementDate: new Date(),
            fname: tutor.FirstName, lname: tutor.LastName, mname: tutor.MiddleName
        })
        setLoading(false)

        dispatch(setTutor());
    }

    if (fetching)
        return <Loading />
    return (
        <div className="form-term-of-use">
            <form onSubmit={userRole === 'admin' ? handleSaveTerms : handleSaveAgreement}>
                <div className='px-4'>
                    <RichTextEditor
                        value={terms}
                        onChange={handleEditorChange}
                        readOnly={!editMode || userRole !== 'admin' || !editMode}
                        placeholder="Enter Term Of  Service"
                        height="60vh"
                        className='mb-5'
                    />
                </div>
                <div className="d-block p-5">
                    <div className="form-check " >
                        <input className="form-check-input" style={{ width: "30px", height: "30px", marginRight: '10px' }} type="checkbox" checked={agreed} onChange={() => setAgreed(true)}
                            disabled={tutor.AgreementDate || userRole !== 'tutor' || !editMode}
                            required={userRole === 'tutor'}
                        />
                        <label className="form-check-label fs-6">
                            By checking the box you agree with the terms of the tutoring academy service.
                        </label>
                    </div>{
                        tutor.AgreementDate &&
                        <div className="text-success">
                            Agreed on -  {showDate(convertToDate(tutor.AgreementDate))}
                        </div>
                    }
                </div>

                <Actions
                    loading={loading}
                    saveDisabled={!editMode || (tutor.AgreementDate && userRole === 'tutor')}
                    editDisabled={editMode}
                    onEdit={() => setEditMode(true)}
                    unSavedChanges={unSavedChanges}
                    nextDisabled={!tutor.AgreementDate}
                />
            </form>

        </div>
    );
}

export default TermOfUse;