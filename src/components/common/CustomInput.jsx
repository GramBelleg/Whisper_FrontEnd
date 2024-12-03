import React from 'react'

const CustomInput = ({ type, id, placeholder, value, onChange, error, touched = true, onKeyPress }) => {
    return (
        <div className='mb-4'>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                className={`w-full p-3 text-dark bg-light border ${error && touched ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-primary focus:outline-none`}
            />
            {error && touched && (
                <span className='text-red-600 text-sm mt-1' id={`error-${id}`}>
                    {error}
                </span>
            )}
        </div>
    )
}

export default CustomInput
