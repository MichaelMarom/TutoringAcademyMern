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

                <div className="student-market-place-body">
                    <div className="student-market-place-top-form">
                        <div className="input-cnt">
                            <input type="radio" name="" id="Ad" />
                            &nbsp;&nbsp;
                            <label htmlFor="Ad">The Ad Will Appear For or 15 Days</label>
                        </div>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <div className="input-cnt">
                            <input type="radio" name="" id="RepeatAd" />
                            &nbsp;&nbsp;
                            <label htmlFor="RepeatAd">Repeat Ad</label>
                        </div>
                    </div>

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

                        <div className="input-cnt">
                            <label htmlFor="">Need Help From Faculty</label>
                            <input type="text" name="" id="Ad" />
                        </div>
                        <div className="input-cnt">
                            <label htmlFor="">Subject</label>
                            <input type="text" name="" id="Ad" />
                        </div>

                    </div>

                </div>
            </div>
        </>
     );
}
 
export default StudentMarketPlace;