import React, { useState, useEffect } from 'react';
import moment from 'moment';

function CustomEvent({ event, handleEventClick, setReservedSlots, reservedSlots, setIsPaymentDone, setBookedSlots }) {
    const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(event.createdAt));
    const [extraFiveMinStart, setExtraFiveMinStart] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newRemainingTime = calculateRemainingTime(event.createdAt);
            setRemainingTime(newRemainingTime);

            if (newRemainingTime.minutes <= 0 && newRemainingTime.seconds === 1 || newRemainingTime.minutes >= 60) {
                clearInterval(intervalId);
                setExtraFiveMinStart(true)
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [event.createdAt]);

    useEffect(() => {
        let intervalId;
        const checkIfOlderThan65Minutes = () => {
            const currentTime = moment();
            const inputTime = moment(event.createdAt);
            const diffInMinutes = currentTime.diff(inputTime, 'minutes');

            if (diffInMinutes >= 65) {
                setReservedSlots(reservedSlots.filter(slot => event.id !== slot.id));
                setExtraFiveMinStart(false)
            }
        };

        if (extraFiveMinStart) {
            checkIfOlderThan65Minutes();
            intervalId = setInterval(checkIfOlderThan65Minutes, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [event.createdAt, extraFiveMinStart]);



    function calculateRemainingTime(createdAt) {
        const createdAtMoment = moment(createdAt);
        const now = moment();
        const duration = moment.duration(now.diff(createdAtMoment));
        const remainingMinutes = 60 - duration.minutes();
        const remainingSeconds = 60 - duration.seconds();
        return {
            minutes: Math.max(remainingMinutes, 0),
            seconds: Math.max(remainingSeconds, 0),
        };
    }

    return (
        <div className={`text-center h-100 ${remainingTime.minutes <= 0 ? 'hidden' : ''}`} style={{ fontSize: "12px" }} onClick={() => handleEventClick(event)}>
            {(remainingTime.minutes <= 0 && remainingTime.seconds === 1) || remainingTime.minutes >= 60 ? (
                <div>
                    {event.title} by {event.studentName} - expired
                </div>
            ) : (
                <div>
                    {event.title} by {event.studentName}
                    {event.type === 'reserved' &&
                        <div>
                            {remainingTime.minutes} : {remainingTime.seconds}
                        </div>
                    }
                </div>
            )}
        </div>
    );
}

export default CustomEvent;
