import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
const PaymentForm = ({ setCreditDebitState, creditDebitState, editMode }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreditDebitState((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputFocus = (e) => {
        setCreditDebitState((prev) => ({ ...prev, focus: e.target.name }));
    };

    return (
        <div className='container m-auto'>
            <div className="d-flex justify-content-center align-items-center mt-4" style={{ gap: "2%" }}>
                <div className="mt-4">
                    <Cards
                        number={creditDebitState.number}
                        expiry={creditDebitState.expiry}
                        cvc={creditDebitState.cvc}
                        name={creditDebitState.name}
                        focused={creditDebitState.focus}
                    />
                </div>

                <div className="mt-3">
                    <form>
                        <div className="mb-3">
                            <input
                                required
                                disabled={!editMode}
                                type="number"
                                name="number"
                                className="form-control"
                                placeholder="Card Number"
                                value={creditDebitState.number}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                required
                                disabled={!editMode}
                                type="text"
                                name="name"
                                value={creditDebitState.name}
                                className="form-control"
                                placeholder="Name"
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <input
                                    required
                                    disabled={!editMode}
                                    type="number"
                                    name="expiry"
                                    className="form-control"
                                    placeholder="Valid Thru"
                                    pattern="\d\d/\d\d"
                                    value={creditDebitState.expiry}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}

                                />
                            </div>
                            <div className="col-6 mb-3">
                                <input
                                    disabled={!editMode}
                                    type="number"
                                    name="cvc"
                                    className="form-control"
                                    placeholder="CVC"
                                    pattern="\d{3,4}"
                                    value={creditDebitState.cvc}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    required
                                />
                            </div>
                        </div>
                        {/* <div className="d-grid">
                            <button className="btn btn-dark">Confirm</button>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
};
export default PaymentForm;