const ChatPrivacy = ({privacy, title, handlePrivacyChange, handlePrivacySubmit}) => {
    return ( 
        <div className="who-can-item">
            <h3 className="text-md mb-4 text-left mb-4 mt-4 text-primary"> {title} </h3>
            <div className='radio-group'>
                <label>
                    <input
                        id="public"
                        type='radio'
                        value='Public'
                        checked={privacy === 'Public'}
                        onChange={handlePrivacyChange}
                    />
                    Public
                </label>

                <label>
                    <input
                        id="private"
                        type='radio'
                        value='Private'
                        checked={privacy === 'Private'}
                        onChange={handlePrivacyChange}
                        data-testid='private'
                    />
                    Private
                </label>
            </div>
            <div className="flex justify-start space-x-4 mt-4">
                <button
                    onClick={handlePrivacySubmit}
                    data-testid='save-privacy'
                    className="text-light bg-primary px-4 py-2 rounded-md hover:bg-light hover:text-dark duration-300"
                >
                    Save 
                </button>
            </div>
        </div>
     );
}
 
export default ChatPrivacy;