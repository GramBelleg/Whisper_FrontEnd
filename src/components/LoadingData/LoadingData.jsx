import './LoadingData.css'
import whisper_logo from '../../assets/images/whisper_logo.png' 

const LoadingData = () => {
    return (
        <div className='loading-container'>
            <div className='loading-logo'>
                <img
                    src={whisper_logo} 
                    alt='Whisper Logo'
                />
            </div>
            <div className='loading-bar'>
                <div className='progress'></div>
            </div>
        </div>
    )
}

export default LoadingData
