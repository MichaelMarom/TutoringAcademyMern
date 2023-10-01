const StudentMarketPlace = () => {


    
    return ( 
        <>
            <div className="student-market-place-cnt">
                <div className="student-market-place-header">
                    <ul>
                        <li>The market place</li>
                        <li>Advertise</li>
                        <li>Tutor's bid</li>
                    </ul>
                </div>

                <div className="student-market-place-report-ad">
                    <input style={{width: '20px', height: '20px', margin: '0'}} type="checkbox" name="" id="reportAd" />
                    &nbsp;
                    <label htmlFor="reportAd"><b>Report Ad</b></label>
                </div>

           

                <br />

                <div className="student-market-place-body">
                    

                    <div className="student-market-place-body-form">
                        <div className="input-cnt">
                            <label htmlFor="">Student Screen ID</label>
                            <input type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Student Grade</label>
                            <input type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Country</label>
                            <input type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Student Language</label>
                            <input type="text" name="" id="Ad" />
                        </div>
                        <div className="input-cnt">
                            <label htmlFor="">Student Country</label>
                            <input type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Need Help From Faculty</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Subject</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>

                        <div className="input-cnt" style={{display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                            <label htmlFor="">Price Range</label>
                            <input  style={{width: '30%'}} type="number" name="" id="Ad" />
                            &nbsp; <b>To</b> &nbsp;
                            <input  style={{width: '30%'}} type="number" name="" id="Ad" />
                        </div>

                    </div>
                    
                    

                    <div className="student-market-place-btm-form">
                        <h4>Student's Requirements</h4>
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Educational Level</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Teaching Experience</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Teacher's Certificate</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Native Language</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">UTC (Time + Date)</label>
                            <select>
                                <option value={''}>Select</option>
                            </select>
                        </div>
                        

                        <textarea style={{height: '100px', width: '400px'}}></textarea>

                    </div>


                    <div className="student-market-place-buttons">
                        <div className="input-cnt">
                            <input style={{width: '20px', height: '20px', margin: '0'}} type="checkbox" name="" id="" />
                            &nbsp;&nbsp;
                            <label htmlFor=""><b>Let the system find my tutor</b></label>
                        </div>

                        <div className="student-market-place-btns">
                            <button style={{background: 'red', color: '#fff'}}>Delete Ad</button>
                            <button style={{background: 'yellow', color: '#fff'}}>Submit Ad</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
     );
}
 
export default StudentMarketPlace;