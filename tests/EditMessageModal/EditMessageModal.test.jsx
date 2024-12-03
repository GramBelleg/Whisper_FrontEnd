import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditMessageModal from '@/components/Modals//EditMessageModal/EditMessageModal'
import { useModal } from '@/contexts/ModalContext'
import { useChat } from '@/contexts/ChatContext'
import { beforeEach, describe, expect, test, vi } from 'vitest'

// Mocking necessary contexts and components
vi.mock('@/contexts/ModalContext', () => ({
  useModal: vi.fn(),
}))

vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn(),
}))

vi.mock('@/components/ChatMessage/ChatMessage', () => ({
  default: ({ message }) => <div data-testid="chat-message">{message.content}</div>,
}))

describe('EditMessageModal', () => {
  const closeModalMock = vi.fn()
  const updateMessageMock = vi.fn()

  beforeEach(() => {
    // Mock the context values
    useModal.mockReturnValue({ closeModal: closeModalMock })
    useChat.mockReturnValue({ updateMessage: updateMessageMock })
  })

  test('renders the EditMessageModal with message content', () => {
    const message = { id: 1, content: 'Test message' }

    render(<EditMessageModal message={message} />)

    expect(screen.getByText('Edit Message')).toBeInTheDocument()
    expect(screen.getByTestId('chat-message')).toHaveTextContent('Test message')
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument() // Input field
  })

  test('updates message content on input change', async () => {
    const message = { id: 1, content: 'Initial message' }
    render(<EditMessageModal message={message} />)

    const inputElement = screen.getByTestId('text-input')
    fireEvent.input(inputElement, { target: { value: 'Updated message' } })

    await waitFor(() => {
        expect(inputElement).toHaveValue('Updated message');
    });
  })

  test('calls updateMessage and closeModal on handleEdit', () => {
    const message = { id: 1, content: 'Initial message' }
    render(<EditMessageModal message={message} />)

    const sendButton = screen.getByTestId('send-button')
    fireEvent.click(sendButton)

    expect(updateMessageMock).toHaveBeenCalledWith(message.id, 'Initial message')
    expect(closeModalMock).toHaveBeenCalled()
  })

  test('closes modal on close icon click', () => {
    const message = { id: 1, content: 'Test message' }
    render(<EditMessageModal message={message} />)

    const closeIcon = screen.getByTestId('close-icon')
    fireEvent.click(closeIcon)

    expect(closeModalMock).toHaveBeenCalled()
  })
})
