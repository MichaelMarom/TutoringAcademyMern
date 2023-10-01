import { useTable } from 'react-table';
import { useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';

const StudentFaculties = () => {

    const [data, useData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);


    const tableInstance = useTable({columns, data})

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return ( 
        <>
            <div className="form-subjects">
                <div className="form-subjects-info">
                    <input type='text' placeholder='Type your subject here' />
                    <input type='text' placeholder='Type your faculty here' />
                    <input type='text' placeholder='Select level' />
                    <input type='text' placeholder='Select experience' />
                    <input type='text' placeholder='Select Certification' />
                    <input type='text' placeholder='Select state' />
                    <input type='text' placeholder='Country' />
                    <input type='text' placeholder='Day state' />

                    <input type="submit" value="Upload" />
                </div>
                <div className="form-subject-alert">
                    <p style={{fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center'}}>400+ subjects to select for tutoring. Did't find your subject? List your expertise above and submit We may list your subject after examination.</p>
                </div>

                <div className="form-subject-data-collection-table">
                    <div className="form-subject-data-tabs">
                        <div id="active">Math</div>
                        <div>Computer Language</div>
                        <div>English</div>
                        <div>Languages</div>
                        <div>Elementary Edu...</div>
                        <div>Business</div>
                        <div>Programming</div>
                        <div>TestProp</div>
                        <div>Art </div>
                        <div>Engineering</div>
                        <div>Aviation</div>
                    </div>
                    <div className="highlight">
                        Checkbox any subject in any faculty where you are proficient enough to tutor, Ultimately you are being rated by the students feedback, if students feedback is only 2 stars then its free checkbox the subject then select the certificate, state expiration if available. Then click on the rate button which will pop up a table to select your rate
                    </div>

                    <div className="form-subject-search-bar">
                        <div>
                            <label style={{float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px'}} htmlFor="search"><h6>Search accross all faculties. type the subject of interest then checkbox to select</h6></label>

                            <div className="search-bar">
                                <input type="search" placeholder='Search Here...' id="search"  /> 
                                <input type="button" value="Search" />
                            </div>
                            

                        </div>

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
            </div>
        </>
     );
}
 
export default StudentFaculties;