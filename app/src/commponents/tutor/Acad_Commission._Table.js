import { useTable } from 'react-table';
import { CommisionCols as CommCol } from '../../Tables/Commission/columns'
import { useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';

const Acad_Commission = () => {

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])

    const data = 
    [
    
        {
            time: '00 - 60 Hr',
            percent: '20%',
        },
        {
            time: '61 - 120 Hr',
            percent: '18%',
        },
        {
            time: '121 - 180 Hr',
            percent: '16%',
        },
        {
            time: '181 - 240 Hr',
            percent: '14%',
        },
        {
            time: '241 - 300 Hr',
            percent: '12%',
        },
        {
            time: '301 > Hr',
            percent: '10%',
        },
        {
            time: 'Demo Lesson',
            percent: '50%',
        }
        
    ]

    const columns = useMemo(() => CommCol, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data});
    return ( 
        <>
            <div className="rate-table">
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

        </>
     );
}
 
export default Acad_Commission;