import { useState, useEffect } from 'react';

const useResendTimer = (initialTime, lastTime) => {
    const [timer, setTimer] = useState(() => {

        const lastResetTime = sessionStorage.getItem(`${lastTime}`);
        console.log('lastReset', lastResetTime);
        if (lastResetTime) {
            console.log('lastReset iff', lastResetTime);
            const elapsedTime = Math.floor((Date.now() - parseInt(lastResetTime, 10)) / 1000);
            console.log('elapsedTime', elapsedTime);
            return Math.max(0, 60 - elapsedTime);
        }
        console.log('lastReset no ret', lastResetTime);
        return initialTime;
    });

    const [canResend, setCanResend] = useState(() => {
        const lastResetTime = sessionStorage.getItem(`${lastTime}`);
        if (lastResetTime) {
            const elapsedTime = Math.floor((Date.now() - parseInt(lastResetTime, 10)) / 1000);
            return elapsedTime >= 60;
        }
        return false;
    });

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        setCanResend(true);
                    }
                    return newTime;
                });
            }, 1000);
        }
        if(timer === 0) {
            setCanResend(true);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timer]);

    const resetTimer = (newTime) => {
        setTimer(newTime);
        setCanResend(false);
        sessionStorage.setItem(`${lastTime}`, Date.now().toString());
        console.log('lastReset', sessionStorage.getItem(`${lastTime}`));
    };

    return { timer, canResend, resetTimer };
};

export default useResendTimer;