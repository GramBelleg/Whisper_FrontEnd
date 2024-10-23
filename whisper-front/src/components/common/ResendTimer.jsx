import React, { useEffect, useState } from 'react';

const ResendTimer = ({ initialTime, canResend, setCanResend }) => {
    const [timer, setTimer] = useState(initialTime);

    useEffect(() => {
        let interval;
        if (!canResend && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }

        return () => clearInterval(interval);
    }, [canResend, timer, setCanResend]);

    return (
        <p className="text-sm text-gray-500 mt-2">
            {canResend ? 'You can resend the code now' : `Resend code in ${timer} seconds`}
        </p>
    );
};

export default ResendTimer;
