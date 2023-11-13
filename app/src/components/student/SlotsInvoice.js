import React from 'react';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import logo from '../../images/tutoring Logo.png'

const SlotsInvoice = ({
  selectedType,
  studentName,
  tutorName,
  invoiceNumber,
  selectedSlots,
  subject,
  rate,
  handleAccept,
  handleClose,
  introDiscountEnabled
}) => {
  const subtotal = selectedSlots.length * (introDiscountEnabled ?
    (parseInt(rate.split('$')[1]) / 2) :
    parseInt(rate.split('$')[1]));

  const rateHalf = (rate) => parseInt(rate.split('$')[1]) / 2;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12 p-2">
          <div className="card">
            <div className="card-header text-center p-0">
              <img src={logo} style={{
                width: "100%",
                height: "100px"
              }} />
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h4 className='text-center mb-3' style={{ fontSize: '16px' }}>Invoice</h4>
                <h5 className='text-center mb-3 text-danger font-weight-bold'
                  style={{ fontSize: '16px' }}>Avail 50% discount on Intro Session</h5>
                <h6 style={{ fontSize: '12px' }}>Student: {studentName}</h6>
                <h6 style={{ fontSize: '12px' }}>Tutor: {tutorName}</h6>
                <h6 style={{ fontSize: '12px' }}>Invoice #: {invoiceNumber}</h6>
              </div>
              <table className="table table-borderless table-striped"
                style={{ fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th className='text-dark  border-0'>Slot</th>
                    <th className='text-dark  border-0'>Subject</th>
                    <th className='text-dark  border-0'>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSlots.map((slot, index) => (
                    <tr key={index}>
                      <td className='border-0'>{showDate(slot.start)}</td>
                      <td className='border-0'>{subject}</td>
                      {(introDiscountEnabled && selectedType === 'intro') ? <>
                        <td className='border-0'>  <s>{rate}</s> ${rateHalf(rate)}.00</td>
                      </>
                        : <td className='border-0'> {rate}</td>}
                    </tr>
                  ))}
                  <tr>
                    <td className='border-0 fw-bold'>Subtotal:</td>
                    <td className='border-0'></td>
                    <td className='border-0 fw-bold'>${subtotal.toFixed(2)}</td>

                  </tr>
                </tbody>
              </table>

              {/* <hr />
              <div className="text-right d-flex justify-content-between px-2">
                <h4 style={{ fontSize: "14px" }}>Subtotal:</h4>
                <h4 style={{ fontSize: "14px" }}> ${subtotal}</h4>
              </div> */}
              <hr />
              <div className='d-flex justify-content-between'>
                <button className='btn btn-small btn-secondary' onClick={handleClose}>Cancel</button>
                <button className='btn btn-small btn-primary' onClick={handleAccept}>Accept</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsInvoice;
