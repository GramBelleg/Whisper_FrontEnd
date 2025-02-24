import { render, screen, fireEvent } from '@testing-library/react'
import ChatActions from '../../src/components/ChatActions/ChatActions'
import { waitFor } from '@testing-library/dom'
import { useModal } from '../../src/contexts/ModalContext'
vi.mock('../../src/contexts/ModalContext', () => ({
    useModal: vi.fn()
}))
describe('ChatActions', () => {
    let openModal, closeModal

    beforeEach(() => {
        openModal = vi.fn()
        closeModal = vi.fn()

        useModal.mockReturnValue({
            openModal,
            closeModal
        })
    })

    vi.mock('@/contexts/ChatContext', () => ({
        useChat: vi.fn(() => ({
            sendMessage: {}
        }))
    }))
    vi.mock('@/contexts/WhisperDBContext', () => ({
        useWhisperDB: vi.fn(() => ({
            dbRef: {
                current: {
                    updateMessage: vi.fn(() => Promise.resolve())
                }
            }
        }))
    }))
    const uploadAttachment = async (name, uploadType, specificBlob = null) => {
        const attachIcon = screen.getByTestId('attach-icon')
        fireEvent.click(attachIcon)
        const attachMenu = await screen.getByTestId('attach-menu')
        expect(attachMenu).toBeInTheDocument()
        const attachFileButton = screen.getByTestId(`attach-${uploadType}`)
        fireEvent.click(attachFileButton)

        const fileInput = screen.getByTestId(`input-${uploadType}`)
        var testFile
        if (specificBlob === null) {
            testFile = new File(['dummy content'], name)
        } else {
            testFile = new File([specificBlob], name)
        }
        fireEvent.change(fileInput, { target: { files: [testFile] } })
    }
    const attachmentPreview = async (name, uploadType, specificBlob = null) => {
        await uploadAttachment(name, uploadType)
        const attachmentPreview = await screen.getByTestId('attachment-preview')
        return attachmentPreview
    }
    test('attachment preview for a file', async () => {
        render(<ChatActions ChatActions />)
        const preview = await attachmentPreview('testfile.txt', 'file')
        const span = preview.querySelector('span')
        console.log(span.textContent)
        expect(span).toHaveTextContent('testfile.txt')
    })
    test('attachment preview long file name', async () => {
        render(<ChatActions ChatActions />)
        const preview = await attachmentPreview('testfilelongestfileever.txt', 'file')
        const span = preview.querySelector('span')
        console.log(span.textContent)
        expect(span).toHaveTextContent('testfilelo...')
    })
    test('remove attachment', async () => {
        render(<ChatActions ChatActions />)
        const preview = await attachmentPreview('testfile.txt', 'file')
        const removeButton = screen.getByTestId('remove-attachment-button')
        expect(removeButton).toBeInTheDocument()
        fireEvent.click(removeButton)
        expect(removeButton).not.toBeInTheDocument()
        expect(preview).not.toBeInTheDocument()
    })
    test('re-add attachment', async () => {
        render(<ChatActions ChatActions />)
        let preview = await attachmentPreview('testfile.txt', 'file')
        const removeButton = screen.getByTestId('remove-attachment-button')
        expect(removeButton).toBeInTheDocument()
        fireEvent.click(removeButton)
        preview = await attachmentPreview('secondfile.txt', 'file')
        const span = preview.querySelector('span')
        console.log(span.textContent)
        expect(span).not.toHaveTextContent('testfile.txt')
        expect(span).toHaveTextContent('secondfile.txt')
    })
    test('image/video upload', async () => {
        render(<ChatActions ChatActions />)
        let preview = await attachmentPreview('testfile.png', 'image')
        const removeButton = screen.getByTestId('remove-attachment-button')
        expect(removeButton).toBeInTheDocument()
        fireEvent.click(removeButton)
        preview = await attachmentPreview('secondfile.mp4', 'image')
        const span = preview.querySelector('span')
        console.log(span.textContent)
        expect(span).not.toHaveTextContent('testfile.png')
        expect(span).toHaveTextContent('secondfile.mp4')
    })
    test('audio upload', async () => {
        render(<ChatActions ChatActions />)
        let preview = await attachmentPreview('testfile.mp3', 'audio')
        const removeButton = screen.getByTestId('remove-attachment-button')
        expect(removeButton).toBeInTheDocument()
    })
    test('bigger than maximum attachment upload', async () => {
        render(<ChatActions ChatActions />)
        const sizeInMB = 100
        const sizeInBytes = sizeInMB * 1024 * 1024
        const largeBlob = new Blob([new ArrayBuffer(sizeInBytes)])
        await uploadAttachment('testfile.txt', 'file', largeBlob)
        await waitFor(() => {
            expect(openModal).toHaveBeenCalled()
        })
    })
})
