import { useState, useRef } from 'react'
import Edit from '@/assets/images/edit.svg?react'
import Tick from '@/assets/images/tick.svg?react'
import ErrorMessage from '@/components/common/ErrorMessage'

const EditableField = ({ initialText, onSave, id, fieldName, error, clearError}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState(initialText)
    const tickButtonRef = useRef(null)

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleInputChange = (e) => {
        setText(e.target.value)
    }

    const handleBlur = (e) => {
        if (tickButtonRef.current && !tickButtonRef.current.contains(e.relatedTarget)) {
            setIsEditing(false)
            clearError(id);
        }
    }

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            await handleSave()
        }
    }

    const handleTickClick = async () => {
        await handleSave()
    }

    const handleSave = async () => {
        try {
            if(initialText!==text)
            {
                await onSave(text)
            }
            clearError(id);
            setIsEditing(false)
        } catch (e) {
            console.log('Error saving:', e)
            setText(initialText)
        }
    }

    return (
        <div className='flex flex-col mb-4 text-left m-4'>
            <label className='text-primary mb-1'>{fieldName}</label>
            {isEditing ? (
                <div className='flex items-center'>
                    <input
                        type='text'
                        value={text}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        id={`profile-${id}`}
                        data-testid={id}
                        className='border-b border-gray-300 bg-transparent break-words text-light w-full focus:outline-none focus:border-primary'
                        autoFocus
                    />
                    <button onClick={handleTickClick} className='ml-2' ref={tickButtonRef} id="button-save-edit" data-testid="button-save-edit">
                        <Tick />
                    </button>
                </div>
            ) : (
                <div className='flex items-center items-start'>
                    <span className='text-lg text-light mr-2 w-full break-words w-full' 
                        data-testid={id}
                        style={{ maxWidth: 'calc(100% - 2rem)' }} >
                        {text}
                    </span>
                    <button onClick={handleEditClick} className='text-gray-500 hover:text-gray-700 focus:outline-none' data-testid={`button-edit-${id}`} id={`button-edit-${id}`}>
                        <Edit />
                    </button>
                </div>
            )}
            <ErrorMessage error={error} id={`error-profile-${id}`} />
        </div>
    )
}

export default EditableField
