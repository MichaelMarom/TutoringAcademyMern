const StudentAccounting = () => {
    return ( 
        <>
            <div className="form-accounting">

                <div style={{margin: 'auto' }} className="form-acct-pay-option">
                    <h6>Set up your payment</h6>
                   

                    <input style={{cursor: 'pointer', fontSize: 'x-small'}} type="radio" value='Paypal' name='p-method' id="" />  Paypal &nbsp; &nbsp; &nbsp;
                    <input style={{cursor: 'pointer', fontSize: 'x-small'}} type="radio" value='Zale' name='p-method' id="" />  Direct Deposit (ACH) &nbsp; &nbsp; &nbsp;
                    <input style={{cursor: 'pointer', fontSize: 'x-small'}} type="radio" value='Bank' name='p-method' id="" />  Credit/Debit (3% transaction fee) &nbsp; &nbsp; &nbsp;

                    <br/>
                    <br/>

                    

                </div>

            </div>
        </>
     );
}
 
export default StudentAccounting;