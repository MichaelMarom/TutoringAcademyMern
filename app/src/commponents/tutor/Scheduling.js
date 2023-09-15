import { useEffect } from "react";

const Scheduling = () => {


    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])
    return ( 
        <>
            <div className="form-scheduling">

                <ul style={{width: '50%', display: 'flex', float: 'left', background: 'transparent', position: 'relative', justifyContent: 'left'}}>
                    <li data-time='month' id='on' style={{float: 'left'}}>Months</li>
                    <li data-time='day' style={{float: 'left'}}>Days</li>
                </ul>
 
                <div className='time-period'>

                    <div id='form-scheduling-cnt' className="form-scheduling-cnt-month">
                        <div className="form-scheduling-cnt-left">
                            <h6>Black out days</h6>

                            <div className="highlight">Checkbox the date that you are not tutoring. students will not be able to setup lessons for your blacked out days</div>

                            <div className="form-scheduling-b-days" style={{position: 'relative', display: 'block', margin: 'auto', marginBottom: '35px', width: '50%', background: '#fff'}}>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="sat" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="sat">Saturday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="sun" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="sun">Sunday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="mon" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="mon">Monday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="tues" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="tues">Tuesday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="wed" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="wed">Wednesday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="thurs" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="thurs">Thursday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="fri" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="fri">Friday</label>
                                </div>

                            </div>

                            <div className="highlight">Double click on a blocke dout day or hour. Will unblock the day or hour for that day or time.</div>
                            
                        </div>

                        <div className="form-scheduling-cnt-right">

                            <div className="form-scheduling-cnt-right-header">

                                

                            </div>

                            <div className="form-scheduling-cnt-right-days">
                                <ul style={{background: '#0088ff', width: '100%', padding: '0', color: '#fff', margin: '0'}}>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Sunday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Monday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Tuesday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Wednesday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Thursday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Friday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Saturday</li>
                                </ul>


                            </div>

                        </div>
                    </div>

                    <div className="form-scheduling-cnt-day">
                        <div className="form-scheduling-cnt-left">
                            <h6>Black out days</h6>

                            <div className="highlight">Checkbox the date that you are not tutoring. students will not be able to setup lessons for your blacked out days</div>

                            <div className="form-scheduling-b-days" style={{position: 'relative', display: 'block', margin: 'auto', marginBottom: '35px', width: '50%', background: '#fff'}}>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="sat" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="sat">Saturday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="sun" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="sun">Sunday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="mon" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="mon">Monday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="tues" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="tues">Tuesday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="wed" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="wed">Wednesday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="thurs" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="thurs">Thursday</label>
                                </div>

                                <div style={{display: 'flex', width: '50%', whiteSpace: 'nowrap'}}>
                                    <input type="checkbox" id="fri" style={{float: 'left'}} />
                                    <label style={{margin: ' 0 10px 15px 10px', float: 'right'}} htmlFor="fri">Friday</label>
                                </div>

                            </div>

                            <div className="highlight">Double click on a blocke dout day or hour. Will unblock the day or hour for that day or time.</div>
                            
                        </div>

                        <div className="form-scheduling-cnt-right">

                            <div className="form-scheduling-cnt-right-header">

                                

                            </div>

                            <div className="form-scheduling-cnt-right-days">
                                <ul style={{background: '#0088ff', width: '100%', padding: '0', color: '#fff', margin: '0'}}>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Sunday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Monday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Tuesday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Wednesday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Thursday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Friday</li>
                                    <li style={{width: '14.28%', fontWeight: 'bold', background: '#0088ff', color: '#fff', margin: '0'}}>Saturday</li>
                                </ul>


                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
     );
}
 
export default Scheduling;