import { useTable } from 'react-table';
import { useEffect, useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Market/columns';
import { useMemo } from 'react';

const MarketPlace = () => {
    const [data, useData] = useState([]);

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])

    const columns = useMemo(() => COLUMNS, []);


    const tableInstance = useTable({columns, data})

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });


    return ( 
        <>
            <div className="tutor-tab-market-place">
                <div className="tutor-tab-subject-data-tabs">
                    <div id="active">Math</div>
                    <div>My Subjects</div>
                    <div>Schedule</div>
                    <div>Post Ads</div>
                    <div>View Market Ads</div>
                    
                </div>

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
 
export default MarketPlace;