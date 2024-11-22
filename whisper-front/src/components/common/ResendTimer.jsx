import React, { useEffect, useState } from 'react';

const ResendTimer = ({ timer }) => {

    return (
        <p className="text-sm text-gray-500 mt-2">
            { `Resend code in ${timer} seconds` }
        </p>
    );
};

export default ResendTimer;
