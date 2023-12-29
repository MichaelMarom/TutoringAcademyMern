
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';
import { get_adminConstants } from '../../axios/admin';
import '../../styles/scrollablebody.css';
const Intro = () => {
    const [intro, set_intro] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const storedUserRole = 'notadmin';
                const result = await get_adminConstants();
                console.log(result)
                set_intro(result.data[0].IntroContent);
            } catch (error) {
                console.error('Error fetching data:', error);

            }
        }
        fetchData();
    }, []);

    // columns.js
    // useEffect(() => {
    //     console.log('hit')
    // }, [])
    // useEffect(() => {
    //     let next = document.querySelector('.tutor-next')

    //     if (next && next.hasAttribute('id')) {
    //         next?.removeAttribute('id');
    //     }
    // }, [])

    return (
        <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab-setup">

            <div className="tutor-tab-intro">
                <h3>Tutoring Academy Platform</h3>
            </div>

            <div style={{ overflowY: "auto", height: "90%" }}>
                <div className='container' dangerouslySetInnerHTML={{ __html: intro }} />
            </div>


        </motion.div>

    );
}

export default Intro;