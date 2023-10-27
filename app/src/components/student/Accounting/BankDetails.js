import React from 'react';

function BankDetails({
    StudentStartDay,
    set_start_day,
    AccountName,
    set_acct_name,
    PaymentType,
    set_acct_type,
    BankName,
    set_bank_name,
    AccountNumber,
    set_acct,
    RoutingNumber,
    set_routing,
    SSH,
    set_ssh,
    AccumulatedHrs,
    set_accumulated_hrs,
    PaymentOption,
    set_payment_option,
}) {

    const handleOptionChange = (e) => {
        set_payment_option(e.target.value);
    };

    return (
        <div className='px-5'>
            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="paypal"
                    checked={PaymentOption === "paypal"}
                    onChange={handleOptionChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                    PayPal
                </label>
            </div>

            <div className="form-check form-check-inline">

                <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="Direct Deposit (ACH)"
                    checked={PaymentOption === "Direct Deposit (ACH)"}
                    onChange={handleOptionChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                    Direct Deposit (ACH)
                </label>
            </div>

            <div className="form-check form-check-inline">
                <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio3"
                    value="credit debit (3% transaction fee)"
                    checked={PaymentOption === "credit debit (3% transaction fee)"}
                    onChange={handleOptionChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio3">
                    Credit/Debit (3% transaction fee)
                </label>
            </div>

            <div className='form-row row'>
                <div className='form-group col-6'>
                    <div className='row'>

                        <label className="col-4">Account Name</label>

                        <input
                            type="text"
                            onChange={(e) => set_acct_name(e.target.value)}
                            value={AccountName} className='form-control col-6 w-50'

                        />
                    </div>
                </div>

                <div className='form-group col-6'>
                    <div className='row'>

                        <label className="col-4">Account Type</label>

                        <select
                            onChange={(e) => set_acct_type(e.target.value)}
                            value={PaymentType} className='form-control col-6 w-50'

                        >
                            <option value="null">Select Account Type</option>
                            <option value="savings">Savings</option>
                            <option value="checking">Checking</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='form-row row'>
                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">Bank Name</label>

                        <input
                            type="text"
                            onChange={(e) => set_bank_name(e.target.value)}
                            value={BankName} className='form-control col-6 w-50'

                        />
                    </div>
                </div>

                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">Account Number</label>

                        <input
                            type="number"
                            onChange={(e) => set_acct(e.target.value)}
                            value={AccountNumber} className='form-control col-6 w-50'

                        />
                    </div>
                </div>
            </div>

            <div className='form-row row'>

                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">Routing Name</label>
                        <input
                            type="text"
                            onChange={(e) => set_routing(e.target.value)}
                            value={RoutingNumber} className='form-control col-6 w-50'

                        />
                    </div>
                </div>

                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">SSH </label>

                        <input
                            type="text"
                            onChange={(e) => set_ssh(e.target.value)}
                            value={SSH} className='form-control col-6 w-50'

                        />
                    </div>
                </div>
            </div>

            <div className='form-row row'>
                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">Accumulated Hours</label>

                        <input
                            type="text"
                            onChange={(e) => set_accumulated_hrs(e.target.value)}
                            value={AccumulatedHrs}
                            className='form-control col-6 w-50'

                        />
                    </div>
                </div>

                <div className='form-group col'>
                    <div className='row'>

                        <label className="col-4">Student Start Day</label>

                        <input
                            type="datetime-local"
                            onChange={(e) => set_start_day(e.target.value)}
                            value={StudentStartDay}
                            className='form-control col-6 w-50'
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default BankDetails;
