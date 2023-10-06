import React from 'react';
import moment from 'moment'

const SlotPill = ({ selectedSlots, handleRemoveSlot, selectedType }) => {
    return (
        <div className='d-flex flex-wrap' style={{ width: '100%' }}>
            {selectedSlots.map((item, index) => (
                <button
                    key={index}
                    className={`p-2 m-2 pill d-flex justify-content-center btn align-item-center gap-2 rounded-pill ${item.type}`}
                    style={{
                        border: `1px solid ${selectedType ? selectedType === 'intro' ? 'rgb(71 180 255)' : selectedType === 'booked' ? '#2db82d' : 'orange ' : 'black'}`,
                        backgroundColor: `${selectedType ? selectedType === 'intro' ? 'rgb(15 121 187 / 22%)' : selectedType === 'booked' ? '#0080001f' : '#ffff404f' : ' gray'}`,
                        color: `${selectedType ? selectedType === 'intro' ? '#0087ff' : selectedType === 'booked' ? '#008b00' : 'orange' : 'black'}`
                    }}
                >
                    {moment(item.start).format('DD/MM hh:mm')}
                    <span
                        className="remove-icon ml-2 cursor-pointer"
                        style={{ color: ` ${selectedType === 'intro' ? 'rgb(71 180 255)' : selectedType === 'booked' ? '#2db82d' : '#b08d13'}` }}
                        onClick={() => handleRemoveSlot(item.start)}
                    >
                        &#x2715;
                    </span>
                </button>
            ))}
        </div>
    );
};

export default SlotPill;
