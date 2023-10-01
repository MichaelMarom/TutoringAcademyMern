import containerVariants from '../constraint';
import {motion} from 'framer-motion';


const StudentSetup = () => {
    
    return ( 
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="form-tutor-setup">
                <form action="">
                    <div className="form-personal-data">
                        <div className="form-group">
                            <div className="profile-photo-cnt">
                                <caption style={{whiteSpace: 'nowrap'}}>Profile Photo</caption>
                                <input type="file" style={{display: 'none'}} id="photo" />
                                <div className="form-photo-frame"></div>
                                <label htmlFor="photo">Upload</label>
                            </div>

                            <div className="profile-details-cnt">


                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="fname">First Name</label>
                                    <input type="text" id="fname" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="mname">Middle Name</label>
                                    <input type="text" id="mname" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="lname">Last Name</label>
                                    <input type="text" id="lname" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="sname">Screen Name</label>
                                    <input type="text" id="sname" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="email">Email</label>
                                    <input type="text" id="email" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="pwd">Password</label>
                                    <input type="text" id="pwd" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="cellphn">Cell Phone</label>
                                    <input type="text" id="cellphn" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="academyid">Academy ID</label>
                                    <input type="text" id="academyid" style={{float: 'right'}} />
                                </div>


                            </div>
                        </div>

                        <div className="form-group">
                            <div className="profile-headline" style={{width: '100%', textAlign: 'center'}}>
                                <label style={{fontWeight: 'bold'}} htmlFor="headline">Headline</label><br />
                                <input type="text" style={{width: '80%', margin: '0'}} />

                                <caption style={{width: '100%', whiteSpace: 'nowrap', display: 'block', textAlign: 'center'}}>Example: 21 years experienced nuclear science professor</caption>

                            </div>
                            <div className="profile-intro" style={{width: '100%', textAlign: 'center'}}>
                                <label style={{fontWeight: 'bold'}} htmlFor="intro">Introduction</label><br />
                                <textarea style={{width: '80%', outline: 'none',height: '250px', border: '1px solid #b0b0b0'}} name="" id="">
                                    
                                </textarea>
                            </div>
                        </div>
                    </div>


                    <div className="form-about-data">
                        <div className="form-group">
                            <div className="profile-video-cnt">
                                <caption style={{whiteSpace: 'nowrap'}}>Produce your profile video </caption>
                                <input type="file" style={{display: 'none'}} id="video" />
                                <div className="form-video-frame"></div>
                                <label htmlFor="video">Upload</label>

                                <div className="form-video-upload-options">
                                    video options pending work
                                </div>
                            </div>

                            <div className="profile-details-cnt">


                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="add1">Address 1</label>
                                    <input type="text" id="add1" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="add2">Address 2</label>
                                    <input type="text" id="add2" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="city">City/Town</label>
                                    <input type="text" id="city" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="state">State/Province</label>
                                    <input type="text" id="state" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="zip">Zip-Code</label>
                                    <input type="text" id="zip" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="country">Country</label>
                                    <input type="text" id="country" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="timeZone">Time Zone GMT</label>
                                    <input type="text" id="timeZone" style={{float: 'right'}} />
                                </div>

                                <div style={{display: 'inline-block', width: '300px', whiteSpace: 'nowrap'}}>
                                    <label style={{margin: ' 0 10px 0 0', float: 'left'}} htmlFor="resZone">Response Zone</label>
                                    <input type="text" id="resZone" style={{float: 'right'}} />
                                </div>


                            </div>
                        </div>

                        <div className="form-group">
                            <div className="profile-motivation" style={{width: '100%', textAlign: 'center'}}>
                                <label style={{fontWeight: 'bold'}} htmlFor="intro">Introduction</label><br />
                                <textarea style={{width: '80%', outline: 'none',height: '250px', border: '1px solid #b0b0b0'}} name="" id="">
                                    
                                </textarea>
                            </div>
                            
                        </div>
                    </div>
                </form>
            </motion.div>
        </>
     );
}
 
export default StudentSetup;