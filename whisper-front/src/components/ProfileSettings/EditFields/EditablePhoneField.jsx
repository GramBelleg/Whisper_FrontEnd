import { useState, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Edit from '@/assets/images/edit.svg?react';
import Tick from '@/assets/images/tick.svg?react';
import ErrorMessage from '@/components/common/ErrorMessage';

const EditablePhoneField = ({ initialPhone, onSave, id, fieldName, error, clearError }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [phone, setPhone] = useState(initialPhone);
    const tickButtonRef = useRef(null);
    const phoneInputRef = useRef(null);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleBlur = (e) => {
        if (
            tickButtonRef.current &&
            !tickButtonRef.current.contains(e.relatedTarget) &&
            !phoneInputRef.current.contains(e.relatedTarget)
        ) {
            setIsEditing(false);
            clearError(id);
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await handleSave();
        }
    };

    const handleTickClick = async () => {
        await handleSave();
    };

    const handleSave = async () => {
        try {
            if(initialPhone!==phone)
            {
                const formattedPhone = `+${phone}`;
                setPhone(formattedPhone); 
                await onSave(formattedPhone);
            }
            clearError(id);
            setIsEditing(false);
        } catch (e) {
            console.log('Error saving:', e);
            setPhone(initialPhone);
        }
    };

    return (
        <div className='flex flex-col mb-4 text-left m-4' ref={phoneInputRef}>
            <label className='text-primary mb-1'>{fieldName}</label>
            {isEditing ? (
                <div className='flex items-center'>
                    <PhoneInput
                        country={'eg'}
                        value={phone}
                        onChange={(value, country) => setPhone(value)}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        inputProps={{
                            name: `phone-${id}`,
                            id: `phone-${id}`,
                            autoFocus: true,
                            className: 'border-b border-gray-300 bg-transparent text-light w-full focus:outline-none focus:border-primary',
                            'data-testid':`phone-${id}`
                        }}
                        buttonStyle={{
                            border: 'none',
                            background: 'transparent'
                        }}
                        containerStyle={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        inputStyle={{
                            width: '100%',
                            paddingLeft: '48px'
                        }}
                        dropdownStyle={{
                            maxHeight: '80px', 
                            overflowY: 'auto',  
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <button onClick={handleTickClick} className='ml-2' ref={tickButtonRef} id="button-save-edit" data-testid="button-save-edit">
                        <Tick />
                    </button>
                </div>
            ) : (
                <div className='flex items-center'>
                    <span className='text-lg text-light mr-2 w-full break-words' style={{ maxWidth: 'calc(100% - 2rem)' }} data-testid={id}>
                        {phone}
                    </span>
                    <button onClick={handleEditClick} className='text-gray-500 hover:text-gray-700 focus:outline-none' id={`button-edit-${id}`} data-testid={`button-edit-${id}`}>
                        <Edit />
                    </button>
                </div>
            )}
            <ErrorMessage error={error} id={`error-phone-${id}`} />
        </div>
    );
};

export default EditablePhoneField;
