import { useTable } from 'react-table';
import { COLUMNS, DATA } from '../../Tables/Prompt/columns';
import { useMemo } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';

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
    const [data, useData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    const tableInstance = useTable({ columns, data })

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab">

                <div className="tutor-tab-intro">
                    <h3>Tutoring Academy Platform</h3>
                </div>

                <div className="tutor-tab-intro-notice shadow-sm">
                    <div className="note-one shadow-sm"></div>
                    <div className="note-two shadow-sm"></div>
                    <div className="note-three shadow-sm"></div>
                </div>


            </motion.div>
        </>
    );
}

export default Intro;