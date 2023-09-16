import { useTable } from 'react-table';
import { useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';

const StudentFaculties = () => {

    const [data, useData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

     
    let multi_student_cols = [{Header: '# Select'}, {Header: 'Subject'}, {Header: 'Level'}, {Header: 'Experience', }, {Header: 'Certification', }, {Header: 'State', }, {Header: 'Expiration', }, {Header: 'Rate', }]


    const tableInstance = useTable({columns, data})

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return ( 
        <>
            <div className="form-subjects">
                <div className="form-subjects-info">
                    {/*<input type='text' placeholder='Type your subject here' />
                    <input type='text' placeholder='Type your faculty here' />
                    <input type='text' placeholder='Select level' />
                    <input type='text' placeholder='Select experience' />
                    <input type='text' placeholder='Select Certification' />
                    <input type='text' placeholder='Select state' />
                    <input type='text' placeholder='Country' />
    <input type='text' placeholder='Day state' />*/}

                    <input type="submit" value="Upload" />
                </div>
                <div className="form-subject-alert">
                    <p style={{fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center'}}>400+ subjects to select for tutoring. Did't find your subject? List your expertise above and submit We may list your subject after examination.</p>
                </div>

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

                <div id="form-subject-data-collection-table">
                    

                    <div className="highlight" style={{width: '100%'}}>
                        Checkbox any subject in any faculty where you are proficient enough to tutor, Ultimately you are being rated by the students feedback, if students feedback is only 2 stars then its free checkbox the subject then select the certificate, state expiration if available. Then click on the rate button which will pop up a table to select your rate
                    </div>

                    <div className="form-subject-search-bar">
                        <div>
                            <label style={{float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px'}} htmlFor="search"><h6>Search accross all faculties. type the subject of interest then checkbox to select</h6></label>

                            <div className="search-bar">
                                <input type="search" placeholder='Search Here...' id="search" tyle={{ outline: 'none', border: 'none'}} /> 
                                <input type="button" value="Search " style={{width: '50px', outline: 'none', border: 'none'}} />
                            </div>
                            

                        </div>

                    </div>

                    <table>
                        <thead>
                            <tr>
                                {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            
                            

                                
                            {

                                
                                //subscription_dicount.map((item, index) => 
                                    //<tr key={index}>
                                       // <td>{(index + 1) * 4 }</td>

                                        //<td>
                                            //<input  onInput={e => setSubscriptionPlan(e.target.value)} type='radio'/*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='student-subscription' id='student-subscription' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                        //</td>

                                        //</tbody><td>{item}</td>
                                   // </tr>
                                //)
                                
                            }
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </>
     );
}
 
export default StudentFaculties;