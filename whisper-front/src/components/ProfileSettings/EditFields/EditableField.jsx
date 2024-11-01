import { useState } from 'react';
import Edit from '@/assets/images/edit.svg?react';
import Tick from '@/assets/images/tick.svg?react';

const EditableField = ({ initialText, onSave, fieldName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onSave(text); 
        }
    };

    const handleTickClick = () => {
        setIsEditing(false);
        onSave(text);
    };

    return (
        <div className="flex flex-col mb-4 text-left m-4">
            <label className="text-primary mb-1">{fieldName}</label>
            {isEditing ? (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={text}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        className="border-b border-gray-300 bg-transparent text-light w-full focus:outline-none focus:border-primary"
                        autoFocus
                    />
                    <button onClick={handleTickClick} className="ml-2">
                        <Tick />
                    </button>
                </div>
            ) : (
                <div className="flex items-center">
                    <span className="text-lg text-light mr-2 w-full">
                        {text}
                    </span>
                    <button onClick={handleEditClick} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <Edit />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditableField;
