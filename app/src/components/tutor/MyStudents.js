import { useTable } from 'react-table';
import { useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Students/columns';
import { useMemo } from 'react';


const MyStudents = () => {

    const [data, useData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);


    const tableInstance = useTable({columns, data})

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return ( 
        <>
            <div className="form-my-students">
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
 
export default MyStudents;