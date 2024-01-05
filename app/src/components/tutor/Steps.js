import React from 'react';

const Steps = ({ steps, currentStep }) => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="d-flex justify-content-between">
                        {steps.map((item, index) => (
                            <div className={`m-2 d-flex align-items-center justify-content-start `}
                                style={{ gap: "10px", width: "25%" }}>

                                <div className=' m-0
                                d-flex align-items-center justify-content-center'
                                    style={{ width: "26%", height: "40px" }}>

                                    <h6 className={`rounded-circle 
                                    text-bg-${item.step < currentStep ? "success" : item.step === currentStep ? "primary" : "secondary"}  
                                    justify-content-center p-2 d-flex align-items-center`}
                                        style={{ width: "40px", height: "40px" }}
                                    >{item.step}</h6>
                                </div>
                                <h5 className='m-0' style={{ width: "42%" }}> {item.name}</h5>
                                {(steps.length - 1 !== index) && <div
                                    style={{ width: "32%", height: "2px", background: "lightgray" }}></div>
                                }  </div>

                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Steps;
