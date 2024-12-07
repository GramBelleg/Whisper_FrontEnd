import './StorageSettings.css'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { putAutoDownloadSize } from '@/services/privacy/privacy'
import { useModal } from '@/contexts/ModalContext'
import ErrorMesssage from '../ErrorMessage/ErrorMessage'
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext'
import useAuth from '@/hooks/useAuth'

const StorageSettings = () => {
    const { user, handleUpdateUser } = useAuth()
    const [autoDownloadSize, setAutoDownloadSize] = useState(user.autoDownloadSize)

    const { openModal, closeModal } = useModal()
    const { pop } = useStackedNavigation()

    const handleGoBack = () => {
        pop()
    }

    const updateUserAutoDownloadSize = async (size) => {
        const prev = autoDownloadSize
        setAutoDownloadSize(size)
        handleUpdateUser("autoDownloadSize", size)
        try {
            await putAutoDownloadSize(size)
        } catch (error) {
            openModal(<ErrorMesssage errorMessage={error.message} onClose={closeModal} appearFor={3000} />)
            setAutoDownloadSize(prev)
        }
    }

    useEffect(() => {
        setAutoDownloadSize(user.autoDownloadSize)
    }, [])
    return (
        <div className='visibility-settings' data-testid='test-visibility-page'>
            <div className='flex gap-4 items-center header'>
                <FontAwesomeIcon data-testid='back-icon' className='back-icon' icon={faArrowLeft} onClick={handleGoBack} />
                <h1>Storage Settings</h1>
            </div>
            <div className='download'>
                <div className='download-item'>
                    <h2>Download media with maximum size of</h2>
                    <div className='radio-group'>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-Everyone'
                                type='radio'
                                value='0'
                                checked={autoDownloadSize === 0}
                                onChange={() => updateUserAutoDownloadSize(0)}
                            />
                            Never Auto Download
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-Everyone'
                                type='radio'
                                value='1'
                                checked={autoDownloadSize === 1}
                                onChange={() => updateUserAutoDownloadSize(1)}
                            />
                            1 Megabyte
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-Contacts'
                                type='radio'
                                value='5'
                                checked={autoDownloadSize === 5}
                                onChange={() => updateUserAutoDownloadSize(5)}
                            />
                            5 Megabytes
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-noone'
                                type='radio'
                                value='25'
                                checked={autoDownloadSize === 25}
                                onChange={() => updateUserAutoDownloadSize(25)}
                            />
                            25 Megabytes
                        </label>
                        <label>
                            <input
                                data-testid='profile-pic-visibiity-noone'
                                type='radio'
                                value='50'
                                checked={autoDownloadSize === 50}
                                onChange={() => updateUserAutoDownloadSize(50)}
                            />
                            50 Megabytes
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StorageSettings
