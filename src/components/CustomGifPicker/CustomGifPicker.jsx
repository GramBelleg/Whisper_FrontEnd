import GifPicker from 'gif-picker-react'
import './CustomGifPicker.css'
const CustomGifPicker = ({ onGifSelect }) => {
    const sendGifFile = async (gifObject) => {
        try {
            const response = await fetch(gifObject.url)
            const blob = await response.blob()

            const file = new File([blob], `${gifObject.id}.gif`, { type: 'image/gif' })
            console.log('gif', file)
            onGifSelect(file)
        } catch (error) {
            console.error('Error converting GIF to File:', error)
        }
    }

    return (
        <div className='bottom-full rounded-lg p-2 shadow-lg bg-gray-800' id='gifs-picker' data-testid='gifs-picker'>
            <GifPicker
                tenorApiKey="AIzaSyB364wG3P7aMI_BKSSYQ347GN9asScxGJM"
                onGifClick={(gif) => {
                    sendGifFile(gif)
                }}
            />
        </div>
    )
}

export default CustomGifPicker
