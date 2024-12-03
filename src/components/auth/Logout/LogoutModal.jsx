import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ErrorMessage from '@/components/common/ErrorMessage'

const LogoutModal = ({ handleCancel }) => {
    const { handleLogout, error, loading } = useAuth()
    const [touched, setTouched] = useState(false)
    const navigate = useNavigate()

    const handleLogoutClick = async () => {
        try {
            setTouched(true)
            const res = await handleLogout()
            console.log(res)
            if (res.success) {
                navigate('/login')
            }
        } catch (e) {
            console.log('Error in logging out:', e.message || e)
        }
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div onClick={handleCancel} className='absolute inset-0 bg-gray-900 bg-opacity-50' />

            <div className='relative bg-light rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl z-10'>
                <h2 className='text-lg font-semibold text-gray-800'>Are you sure you want to log out?</h2>

                {touched && <ErrorMessage error={error} id='error-logout' />}

                <div className='mt-4 flex justify-end space-x-3'>
                    <button
                        onClick={handleLogoutClick}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white font-semibold ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                        }`}
                        id='logout-ok-btn'
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>

                    <button
                        className='px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400'
                        onClick={handleCancel}
                        id='cancel-logout-btn'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutModal
