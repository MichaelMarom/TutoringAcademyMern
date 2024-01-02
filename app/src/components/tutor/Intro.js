
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useEffect } from 'react';
// import containerVariants from '../constraint';
// import { get_adminConstants } from '../../axios/admin';
// // import '../../styles/scrollablebody.css';
// const Intro = () => {
//     const [intro, set_intro] = useState('');
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // const storedUserRole = 'notadmin';
//                 const result = await get_adminConstants();
//                 console.log(result)
//                 set_intro(result.data[0].IntroContent);
//             } catch (error) {
//                 console.error('Error fetching data:', error);

//             }
//         }
//         fetchData();
//     }, []);

//     // columns.js
//     // useEffect(() => {
//     //     console.log('hit')
//     // }, [])
//     // useEffect(() => {
//     //     let next = document.querySelector('.tutor-next')

//     //     if (next && next.hasAttribute('id')) {
//     //         next?.removeAttribute('id');
//     //     }
//     // }, [])

//     return (
//         <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab-setup">

//             <div className="tutor-tab-intro">
//                 <h3>Tutoring Academy Platform</h3>
//             </div>

//             <div style={{ overflowY: "auto", height: "90%" }}>
//                 <div className='container' dangerouslySetInnerHTML={{ __html: intro }} />
//             </div>


//         </motion.div>

//     );
// }

// export default Intro;


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
import { useLocation } from 'react-router';
import Loading from '../common/Loading';

const Intro = () => {
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    const [db_intro, set_db_intro] = useState('');

    const [intro, set_intro] = useState('');
    const userRole = localStorage.getItem("user_role")
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get_adminConstants();
                set_intro(result.data[0].IntroContent);
                set_db_intro(result.data[0].IntroContent);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setFetching(false)
        };

        fetchData();
    }, []);

    useEffect(() => {
        setUnsavedChanges(intro !== undefined && db_intro !== undefined && intro !== db_intro)
    }, [intro, db_intro]);

    const handleEditorChange = (value) => {
        set_intro(value);
    };
    const handleEditClick = () => {
        setEditMode(true);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true)
        const response = await post_termsOfUse({ IntroContent: intro });
        set_db_intro(response.data.IntroContent);
        setEditMode(false);
        setLoading(false)
    };
    if (fetching)
        return <Loading />
    return (
        <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab">
            <form onSubmit={handleSave}>
                <div className='px-4'>
                    <RichTextEditor
                        value={intro}
                        onChange={handleEditorChange}
                        readOnly={!editMode}
                        placeholder="Enter Your Work Experience"
                        style={{ height: "100vh" }}
                    />
                </div>
                <Actions
                    loading={loading}
                    saveDisabled={!userRole || userRole !== 'admin'} // Disable save if user role is not admin
                    editDisabled={!userRole || userRole !== 'admin'} // Disable edit if user role is not admin
                    onEdit={handleEditClick}
                    unSavedChanges={unSavedChanges}
                />
            </form>
        </motion.div>
    );
}

export default Intro;