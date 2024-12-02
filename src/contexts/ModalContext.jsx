import { createContext, useContext, useEffect, useState } from 'react'

const ModalContext = createContext()

export function ModalProvider({ children }) {
    // State for the general modal
    const [isOpen, setIsOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)

    // State for the confirmation modal
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
    const [confirmationContent, setConfirmationContent] = useState(null)
    const [confirmationCallback, setConfirmationCallback] = useState(null)

    // Escape key handling
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                if (isOpen) closeModal()
                if (isConfirmationOpen) closeConfirmationModal()
            }
        }

        window.addEventListener('keydown', handleEscKey)

        return () => {
            window.removeEventListener('keydown', handleEscKey)
        }
    }, [isOpen, isConfirmationOpen])

    // Functions for the general modal
    const openModal = (content) => {
        setModalContent(content)
        setIsOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setIsOpen(false)
        setTimeout(() => {
            setModalContent(null)
            document.body.style.overflow = 'unset'
        }, 300)
    }

    const openConfirmationModal = (content, onConfirm) => {
        setConfirmationContent(content)
        setConfirmationCallback(() => onConfirm)
        setIsConfirmationOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const closeConfirmationModal = () => {
        setIsConfirmationOpen(false)
        setTimeout(() => {
            setConfirmationContent(null)
            setConfirmationCallback(null)
            document.body.style.overflow = 'unset'
        }, 300)
    }

    const confirmAction = () => {
        if (confirmationCallback) {
            confirmationCallback()
        }
        closeConfirmationModal()
    }

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                openModal,
                closeModal,
                isConfirmationOpen,
                openConfirmationModal,
                closeConfirmationModal
            }}
        >
            {children}

            {/* General modal */}
            {isOpen && (
                <div className='modal-overlay' onClick={closeModal}>
                    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                        {modalContent}
                    </div>
                </div>
            )}

            {isConfirmationOpen && (
                <div className='modal-overlay' onClick={closeConfirmationModal}>
                    <div
                        className='modal-content relative bg-light rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl z-10'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='p-4 text-2xl'>{confirmationContent}</div>

                        <div className='mt-4 flex justify-center space-x-3'>
                            <button
                                onClick={confirmAction}
                                data-testid='confirm-action-btn'
                                className='px-4 py-2 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600'
                            >
                                Confirm
                            </button>
                            <button
                                onClick={closeConfirmationModal}
                                className='px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)
