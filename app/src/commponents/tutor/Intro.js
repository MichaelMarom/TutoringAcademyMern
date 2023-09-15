import { useTable } from 'react-table';
import { COLUMNS,DATA } from '../../Tables/Prompt/columns';
import { useMemo } from 'react';
import { useState } from 'react';
import {motion} from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';

const Intro = () => {

    // columns.js

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])
    const [data, useData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    axios.get('', {
        params: {
            data: 'hello'
        }
    })
    .then(() => {
        
    })
    .catch(err => {
        console.log(err)
    })

    const tableInstance = useTable({columns, data})

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

                <div className="tutor-tab-intro-prompt shadow-sm">
                   
                    <table {...getTableProps()}>
                        <thead>
                            {
                                headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {
                                            headerGroup.headers.map((column) => (
                                                <th {...column.getHeaderProps()}>
                                                    {column.render('Header')}
                                                </th>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </thead>

                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            </motion.div>
        </>
     );
}
 
export default Intro;