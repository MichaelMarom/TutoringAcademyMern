import { useEffect, useState } from 'react';
import { get_bank_details, upload_form_four } from '../../../axios/tutor';
import { showDate } from '../../../helperFunctions/timeHelperFunctions';
import Acad_Commission from './Acad_Commission._Table';
import Actions from '../../common/Actions'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { COMMISSION_DATA } from '../../../constants/constants';

const TutorAccSetup = ({ sessions }) => {
    const { tutor } = useSelector(state => state.tutor)
    let date = new Date().toDateString();
    const [email, set_email] = useState(tutor.Email);
    let [start_day, set_start_day] = useState(date)
    let [acct_name, set_acct_name] = useState(null)
    let [acct_type, set_acct_type] = useState(null)
    let [bank_name, set_bank_name] = useState(null)
    let [acct, set_acct] = useState(null)
    let [routing, set_routing] = useState(null)
    let [ssh, set_ssh] = useState(null)
    let [accumulated_hrs, set_accumulated_hrs] = useState(null)
    let [commission, set_commission] = useState(null)
    let [total_earning, set_total_earning] = useState(null)
    let [payment_option, set_payment_option] = useState(null)

    useEffect(() => {
        set_email(tutor.Email)
    }, [tutor])

    const commissionAccordingtoNumOfSession = (sr) => {
        const commissionEntry = COMMISSION_DATA.find(entry => {
            if (!entry.higher) {
                return sr >= entry.lower && sr <= entry.higher;
            } else {
                return sr >= entry.lower;
            }
        });
        return commissionEntry ? commissionEntry.percent : null
    }

    const totalNet = sessions.reduce((sum, session) => sum + session.net, 0)

    const validate = () => {
        const fields = { SSH: { value: ssh, pattern: /^\d{3}-\d{2}-\d{4}$/ } };

        if (fields.SSH.value?.length && !fields.SSH.pattern.test(fields.SSH.value)) {
            toast.warning('Please follow XXX-XX-XXXX pattern for SSH');
            return false
        }
        return true
    }

    let saver = async (e) => {
        e.preventDefault()

        let user_id = window.localStorage.getItem('tutor_user_id');
        if (validate())
            if (payment_option === 'Bank') {

                let response = await upload_form_four(email, start_day, acct_name, acct_type, bank_name, acct, routing, ssh, accumulated_hrs, commission, total_earning, payment_option, user_id);
                if (response) {
                    toast.success("Succesfully Saved The Bank Info.")
                } else {
                    toast.error("Error while Saving the Bank Info.")
                }

            } else {
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                let response = await upload_form_four(email, start_day, acct_name, acct_type, bank_name, acct, routing, ssh, accumulated_hrs, commission, total_earning, payment_option, user_id);
                if (response) {
                    toast.success("Succesfully Saved The Bank Info.")
                } else {
                    toast.error("Error while Saving the Bank Info.")
                }
            }
    }

    useEffect(() => {
        get_bank_details(window.localStorage.getItem('tutor_user_id'))
            .then((result) => {
                if (result[0]) {
                    const data = result[0]
                    set_payment_option(data.PaymentOption);
                    set_routing(data.Routing === "null" ? null : data.Routing)
                    set_ssh(data.SSH === "null" ? null : data.SSH)
                    set_acct_name(data.AccountName === "null" ? null : data.AccountName)
                    set_acct_type(data.AccountType === "null" ? null : data.AccountType)
                    set_bank_name(data.BankName === "null" ? null : data.BankName)
                    set_acct(data.Account === "null" ? null : data.Account)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (

        <div className="tutor-tab-accounting">

            <div className="tutor-tab-acct-start-day">
                <h6>Tutor's Start Day (First tutoring lesson)</h6>
                <p className="border px-4  py-2 rounded m-2">{showDate(sessions?.[sessions.length - 1]?.start)}</p>

                <div className="tutor-tab-rates-btm-options"
                    style={{ height: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto', marginTop: '80px' }}>

                    <div className="highlight">
                        Hours are accumulated on annual bases which will start counting from Tutor's start day.
                    </div>

                    <Acad_Commission />

                </div>
            </div>
            <form onSubmit={saver}>
                <div className="tutor-tab-acct-pay-option">
                    <h6>How do you want to be paid?</h6>
                    <div className="highlight">
                        Tutor academy pays every second Friday for the lessons performed up to the previous Friday midnight (GMT-5), Please select below the form of payment you prefer. Keep in mind that it can takes 1-3 days until the funds in your account
                    </div>

                    <div className='d-flex align-items-center justify-content-between '>

                        <div style={{ float: 'left' }}>
                            <input required
                                checked={payment_option === 'Paypal'}
                                style={{
                                    float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                    fontSize: 'x-small'
                                }}
                                type="radio"
                                onChange={(e) => set_payment_option(e.target.value)}
                                className='m-0'
                                value='Paypal' name='p-method' id="" />
                            <span className='m-0'>Paypal</span>
                        </div>
                        <div style={{ float: 'left' }}>
                            <input className='m-0'
                                checked={payment_option === 'Zale'}
                                style={{
                                    float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                    fontSize: 'x-small'
                                }} type="radio"
                                onChange={(e) => set_payment_option(e.target.value)} value='Zale' name='p-method' id="" />
                            <span className='m-0'>Zelle</span>
                        </div>
                        <div className='m-0' style={{ float: 'left' }}>
                            <input className='m-0'
                                checked={payment_option === 'Bank'}
                                style={{
                                    float: 'left', width: '30px', cursor: 'pointer', height: '20px',
                                    fontSize: 'x-small'
                                }} type="radio" value='Bank'
                                onChange={(e) => set_payment_option(e.target.value)} name='p-method' id="" />
                            <span className='m-0'>Bank account (PCH)</span>
                        </div>

                    </div>


                    {payment_option === "Bank" &&
                        <div className=' mt-4'>

                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="acct-name">Account Name</label>
                                <input required type="text" className='form-control' onInput={e => set_acct_name(e.target.value)} id="acct-name" defaultValue={acct_name} style={{ float: 'right', width: '60%' }} />
                            </div>


                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="acct-type">Account Type</label>

                                <select className='form-select' dname="" id="" onInput={e => set_acct_type(e.target.value)} style={{ float: 'right', width: '60%', margin: '0  0 10px 0', padding: '0 8px 0 8px', cursor: 'pointer' }}>
                                    <option selected={acct_type === '' ? 'selected' : ''} value="null">Select Account Type</option>
                                    <option selected={acct_type === 'savings' ? 'selected' : ''} value="savings">Savings</option>
                                    <option selected={acct_type === 'checking' ? 'selected' : ''} value="checking">Checking</option>
                                </select>
                            </div>

                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="bank-name">Bank Name</label>
                                <input className='form-control' required type="text" onInput={e => set_bank_name(e.target.value)} defaultValue={bank_name} id="bank-name" style={{ float: 'right', width: '60%' }} />
                            </div>

                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="acct">Account #</label>
                                <input className='form-control' required type="number" onInput={e => set_acct(e.target.value)} defaultValue={acct} id="acct" style={{ float: 'right', width: '60%' }} />
                            </div>

                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="routing">Routing #</label>
                                <input className='form-control' required type="text" onInput={e => set_routing(e.target.value)} defaultValue={routing} id="routing" style={{ float: 'right', width: '60%' }} />
                            </div>
                        </div>
                    }
                    {payment_option === "Paypal" &&

                        <div className=' mt-4'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <label htmlFor="acct-name">Email</label>
                                <input required type="email" className='form-control'
                                    onInput={e => { set_email(e.target.value) }}
                                    id="acct-name" value={email}
                                    style={{ float: 'right', width: '60%' }} />
                            </div>

                        </div>}

                </div>

                <div className="tutor-tab-acct-time-range">
                    <label htmlFor="">SS# (Social Security Number) &nbsp;</label>
                    <input className='form-control'
                        required={totalNet > 600}
                        onInput={e => set_ssh(e.target.value)}
                        defaultValue={ssh} type="text"
                        placeholder='XXX-XX-XXXX'
                    />

                    <div className="highlight">
                        Social security needs to be provided only from US residents for annual EARNING over $600. Form 1099 to be issued by the academy.
                    </div>

                    <div className='d-flex align-items-center mb-2 justify-content-between'>
                        <label htmlFor="accumulated-hrs">Accumulated Hours</label>
                        <input className='form-control m-0' type="text"
                            value={`${sessions.length}:00`}
                            style={{ float: 'right', width: '50%' }} disabled />
                    </div>

                    <div className='d-flex align-items-center mb-2 justify-content-between'>
                        <label htmlFor="commission">Service charge %</label>
                        <input className='form-control m-0' type="text"
                            value={`${commissionAccordingtoNumOfSession(sessions.length)} %`}
                            id="commission"
                            style={{ float: 'right', width: '50%' }} disabled
                        />
                    </div>

                    <div className='d-flex align-items-center mb-2 justify-content-between'>
                        <label htmlFor="total-earning">Total Earning This year.</label>
                        <input className='form-control m-0' type="text"
                            value={totalNet.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            id="total-earning"
                            style={{ float: 'right', width: '50%' }} disabled />
                    </div>
                </div>
                <Actions />
            </form>
        </div>

    );
}

export default TutorAccSetup;