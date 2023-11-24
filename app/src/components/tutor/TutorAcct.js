import { useEffect, useState } from 'react';
import { get_bank_details, upload_form_four } from '../../axios/tutor';
import Acad_Commission from './Acad_Commission._Table';

const TutorAcct = () => {

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next && next.hasAttribute('id')){
            next?.removeAttribute('id');
        }
    }, [])

    let date = new Date().toDateString();
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

    let handle_bank = (e) => {
        let bank_elem = document.querySelector('.tutor-bank-info')
        set_payment_option(e.target.value);

        let value = e.target.value;
        if(value === 'Bank'){
            bank_elem?.setAttribute('id', 'tutor-bank-info')
        }else{
            bank_elem?.removeAttribute('id')
        }
    }

    

    if(document.querySelector('#tutor-save')){

        document.querySelector('#tutor-save').onclick = () => saver();

    }

    let user_id = window.localStorage.getItem('tutor_user_id');

    let saver = async() => {
        //let response = await upload_form_four(start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,user_id);

        let inputs_datas = [...document.querySelectorAll('input')];
        let inputs = inputs_datas.splice(1,inputs_datas.length);
        let select = [...document.querySelectorAll('select')];

        let list = [...inputs,...select]
        console.log(list)
        let data = validtor(list)
        let  negative_agent = data.filter(item => item === false);
        let positive_agent = data.filter(item => item === true);

        if(payment_option === 'Bank'){
            if(negative_agent.length === 0){
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                let response = await upload_form_four(start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,user_id);
                if(response){
                    setTimeout(() => {
                        document.querySelector('.save-overlay')?.removeAttribute('id');
                    }, 1000);
    
                    document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin')?.removeAttribute('id');
                    }, 2000);
                }else{
                    document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin')?.removeAttribute('id');
                    }, 2000);
    
                }
            }
        
        }else{
            console.log(negative_agent.length, positive_agent.length)
            if(negative_agent.length === 0 && positive_agent.length === 7){
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                let response = await upload_form_four(start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,user_id);
                if(response){
                    setTimeout(() => {
                        document.querySelector('.save-overlay')?.removeAttribute('id');
                    }, 1000);
    
                    document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                    setTimeout(() => {
                        
                        document.querySelector('.tutor-popin')?.removeAttribute('id');
                    }, 2000);
                }else{
                    document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin')?.removeAttribute('id');
                    }, 2000);
    
                }
            }
        }
        
    }

    useEffect(() => {
        get_bank_details(window.localStorage.getItem('tutor_user_id'))
        .then((result) => {
            console.log(result[0])
            set_payment_option(result[0].PaymentOption);
            set_routing(result[0].Routing)
            set_ssh(result[0].SSH)
            set_total_earning(result[0].TotalEarning)
            set_accumulated_hrs(result[0].AccumulatedHrs)
            set_commission(result[0].Commission)
            set_acct_name(result[0].AccountName)
            set_acct_type(result[0].AccountType)
            set_bank_name(result[0].BankName)
            set_acct(result[0].Account)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    let validtor = list => {
        let bool_list = [];

        let elm_check = document.querySelector('.tutor-bank-info');

        list.map(item => {
            if(payment_option === 'Bank'){
                if(item.value === '' || item.value === null){
                    item.style.border = '1px solid red'
                    bool_list.push(false)
                }else{
                    item.style.border = '1px solid black'
                    bool_list.push(true)
                }
            }else{
                if(item.parentElement.parentElement !== elm_check){
                    if(item.value === '' || item.value === null){
                        item.style.border = '1px solid red'
                        bool_list.push(false)
                    }else{
                        item.style.border = '1px solid black'
                        bool_list.push(true) 
                    }
                }
            }
        });
        return bool_list;

    }
    return ( 
        <>
            <div className="tutor-tab-accounting">

                <div className="tutor-tab-acct-start-day">
                    <h6>Tutor's Start Day (First tutoring lesson)</h6>
                    <input style={{pointerEvents: 'none'}} value={date}  placeHolder='Tuesday' />

                    <div className="tutor-tab-rates-btm-options" style={{height: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto', marginTop: '80px'}}>

                            <div className="highlight">
                                Hours are accumulated on annual bases that will start counting from your enrollment.
                            </div>

                            <Acad_Commission />

                    </div>
                </div>

                <div className="tutor-tab-acct-pay-option">
                    <h6>How do you want to be paid?</h6>
                    <div className="highlight">
                        Tutor academy pays every second Friday for the lessons performed up to the previous Friday midnight (GMT-5), Please select below the payment Payment you prefer. Keep in mind that it can take 1-3 days until you see the funds in your account
                    </div>

                    <div style={{display: 'inline-block', width: '100%', padding: '0'}}>
                    
                        <div  style={{float: 'left', margin: '0 0 20px 0', width: '50%'}}>
                            <input defaultChecked={payment_option === 'Paypal' ? 'defaultChecked' : ''} 
                            style={{float: 'left', width: '30px', cursor: 'pointer', height: '20px', fontSize: 'x-small'}} 
                            type="radio" onInput={handle_bank} 
                            value='Paypal' name='p-method' id="" />  
                            <span>Paypal</span> 
                        </div>

                        <div  style={{float: 'left', margin: '0 0 20px 0', width: '50%'}}>
                            <input defaultChecked={payment_option === 'Zale' ? 'defaultChecked' : ''} style={{float: 'left', width: '30px', cursor: 'pointer', height: '20px', fontSize: 'x-small'}} type="radio" onInput={handle_bank} value='Zale' name='p-method' id="" />   
                            <span>Zell</span>
                        </div>
                        
                        <div  style={{float: 'left', margin: '0 0 20px 0', width: '50%'}}>
                            <input defaultChecked={payment_option === 'Bank' ? 'defaultChecked' : ''} style={{float: 'left', width: '30px', cursor: 'pointer', height: '20px', fontSize: 'x-small'}} type="radio" value='Bank' onInput={handle_bank} name='p-method' id="" />    
                            <span>Bank account</span>
                        </div>

                    </div>

                    <br/>
                    <br/>

                    <div className='tutor-bank-info'>

                        <div style={{display: 'inline-block', width: '350px', whiteSpace: 'nowrap'}}>
                            <label style={{margin: ' 0 10px 0 0', width: '30%', float: 'left'}} htmlFor="acct-name">Account Name</label>
                            <input type="text" onInput={e => set_acct_name(e.target.value)} id="acct-name" defaultValue={acct_name} style={{float: 'right', width: '60%'}} />
                        </div>

                    
                        <div style={{display: 'inline-block', width: '350px', whiteSpace: 'nowrap'}}>
                            <label style={{margin: ' 0 10px 0 0', width: '30%', float: 'left'}} htmlFor="acct-type">Account Type</label>

                            <select dname="" id="" onInput={e => set_acct_type(e.target.value)} style={{float: 'right', width: '60%', margin: '0  0 10px 0', padding: '0 8px 0 8px', cursor: 'pointer'}}>
                                <option selected={acct_type === '' ? 'selected' : ''} value="null">Select Account Type</option>
                                <option selected={acct_type === 'savings' ? 'selected' : ''} value="savings">Savings</option>
                                <option selected={acct_type === 'checking' ? 'selected' : ''} value="checking">Checking</option>
                            </select>
                        </div>

                        <div style={{display: 'inline-block', width: '350px', whiteSpace: 'nowrap'}}>
                            <label style={{margin: ' 0 10px 0 0', width: '30%', float: 'left'}} htmlFor="bank-name">Bank Name</label>
                            <input type="text" onInput={e => set_bank_name(e.target.value)} defaultValue={bank_name} id="bank-name" style={{float: 'right', width: '60%'}} />
                        </div>

                        <div style={{display: 'inline-block', width: '350px', whiteSpace: 'nowrap'}}>
                            <label style={{margin: ' 0 10px 0 0', width: '30%', float: 'left'}} htmlFor="acct">Account #</label>
                            <input type="number" onInput={e => set_acct(e.target.value)} defaultValue={acct} id="acct" style={{float: 'right', width: '60%'}} />
                        </div>

                        <div style={{display: 'inline-block', width: '350px', whiteSpace: 'nowrap'}}>
                            <label style={{margin: ' 0 10px 0 0', width: '30%', float: 'left'}} htmlFor="routing">Routing #</label>
                            <input type="text" onInput={e => set_routing(e.target.value)} defaultValue={routing} id="routing" style={{float: 'right', width: '60%'}} />
                        </div>
                    </div>

                </div>

                <div className="tutor-tab-acct-time-range">
                    <label htmlFor="">SSH &nbsp;</label>
                    <input onInput={e => set_ssh(e.target.value)} defaultValue={ssh} type="text" />

                    <br />
                    <br />
                    <br />
                    <br />

                    <div className="highlight">
                        Social security needs to be provided only from US residents for accounts over $50 and for 1099 form over $600 annually.
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />

                    <div style={{display: 'inline-block', width: '380px', whiteSpace: 'nowrap'}}>
                        <label style={{margin: ' 0 10px 0 0', float: 'left',  width: '20%'}} htmlFor="accumulated-hrs">Accumulated Hours</label>
                        <input type="text" defaultValue={accumulated_hrs} onInput={e => set_accumulated_hrs(e.target.value)} id="accumulated-hrs" style={{float: 'right',  width: '60%'}} />
                    </div>

                    <div style={{display: 'inline-block', width: '380px', whiteSpace: 'nowrap'}}>
                        <label style={{margin: ' 0 10px 0 0', float: 'left',  width: '20%'}} htmlFor="commission">Commission %</label>
                        <input type="text" defaultValue={commission} onInput={e => set_commission(e.target.value)} id="commission" style={{float: 'right',  width: '60%'}} />
                    </div>

                    <div style={{display: 'inline-block', width: '380px', whiteSpace: 'nowrap'}}>
                        <label style={{margin: ' 0 10px 0 0', float: 'left',  width: '20%'}} htmlFor="total-earning">Total Earning</label>
                        <input type="text" defaultValue={total_earning} onInput={e => set_total_earning(e.target.value)} id="total-earning" style={{float: 'right',  width: '60%'}} />
                    </div>

                    
                </div>

            </div>
        </>
     );
}
 
export default TutorAcct;