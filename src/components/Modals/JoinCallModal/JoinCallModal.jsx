import React, { useEffect } from "react";
import './JoinCallModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faPhoneSlash } from "@fortawesome/free-solid-svg-icons";

const JoinCallModal = ({userName, onAccept, onReject}) => {
    const acceptCall = async () => {
       await onAccept();
    }

    const rejectCall = async () => {
        await onReject();
    }

    useEffect(() => {
        // play an incoming call sound
        // clean up the sound when the component unmounts
        const audio = new Audio('/sounds/ringtone.mp3');
        audio.loop = true;
        audio.play();
        return () => {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    return (
        <div className="join-call-modal">
            <h1>Join Call</h1>
            <p>Would you like to join a call with {userName}?</p>
            <div className="buttons">
                <button className="accept" onClick={acceptCall}>
                    <FontAwesomeIcon icon={faPhone} />
                </button>
                <button className="reject" onClick={rejectCall}>
                    <FontAwesomeIcon icon={faPhoneSlash} />
                </button>
            </div>
        </div>
    );
}

export default JoinCallModal;