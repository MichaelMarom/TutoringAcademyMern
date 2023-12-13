import { useTable } from 'react-table';
import { COLUMNS, DATA } from '../../Tables/Prompt/columns';
import { useMemo } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';
import RichTextEditor from '../common/RichTextEditor/RichTextEditor';
import Actions from '../common/Actions';
import { get_adminConstants, post_termsOfUse } from '../../axios/admin';

const Intro = () => {

    // columns.js
    useEffect(() => {
        console.log('hit')
    }, [])
    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next?.removeAttribute('id');
        }
    }, [])
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    const [db_intro,set_db_intro]=useState('');

    const [intro, set_intro] = useState('');
    const [userRole, setUserRole] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserRole = localStorage.getItem('user_role');
                const result = await get_adminConstants();
                set_intro(result.data[0].IntroContent);
                set_db_intro(result.data[0].IntroContent);
                setUserRole(storedUserRole);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    
        return () => {
            // Cleanup logic, if needed
        };
    }, []);
    useEffect(() => setUnsavedChanges(intro !== db_intro), [intro, db_intro]);

    const handleEditorChange = (value) => {
        set_intro(value);
    };
    const handleEditClick = () => {
        setEditMode(true);
    };
    const handleSave = async(e) => {
        e.preventDefault();

        const response = await post_termsOfUse({ IntroContent:intro});
        console.log(response.data);
        // Add your save logic here

        // After saving, set editing mode back to false
        setEditMode(false);
    };

    return (
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab">

                <div className="tutor-tab-intro">
                    <h3>Tutoring Academy Platform</h3>
                </div>

                {/* <div className="tutor-tab-intro-notice shadow-sm">
                    <div className="note-one shadow-sm"></div>
                    <div className="note-two shadow-sm"></div>
                    <div className="note-three shadow-sm"></div>
                </div> */}
                <form action='' onSubmit={handleSave}>
                    <div className='px-4'>
                        <RichTextEditor
                            value={intro}
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
            </motion.div>
        </>
    );
}

export default Intro;