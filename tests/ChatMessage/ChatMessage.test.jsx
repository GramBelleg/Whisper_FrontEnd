import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModalProvider } from '@/contexts/ModalContext'
import ChatMessage from '@/components/ChatMessage/ChatMessage'
import { messageTypes } from '@/services/sendTypeEnum'

vi.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon, height }) => (
        <div data-testid='font-awesome-icon' data-icon={icon.iconName} data-height={height}>
            {icon.iconName}
        </div>
    )
}))

vi.mock('@/services/chatservice/whoAmI', () => ({
    whoAmI: { id: 'authenticatedUserId' }
}))

const renderWithModal = (component) => {
    return render(<ModalProvider>{component}</ModalProvider>)
}

const messageStates = {
    sent: {
        test_id: 'sent-icon'
    },
    delivered: {
        test_id: 'delivered-icon'
    },
    read: {
        test_id: 'read-icon'
    },
    pending: {
        test_id: 'pending-send-icon'
    }
}

describe('ChatMessage', () => {
    const mockOnDelete = vi.fn()
    const mockOnReply = vi.fn()

    vi.mock('wavesurfer.js', () => ({
        default: {
            create: () => ({
                load: vi.fn(),
                on: vi.fn((event, callback) => {
                    if (event === 'decode') {
                        callback(60) // Mock duration of 60 seconds
                    }
                }),
                playPause: vi.fn(),
                getCurrentTime: vi.fn(),
                destroy: vi.fn()
            })
        }
    }))

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders text message correctly', () => {
        const message = {
            type: messageTypes.TEXT,
            content: 'Hello World',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 'sent'
        }

        renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        expect(screen.getByText(message.content)).toBeInTheDocument()
        expect(screen.getByText(message.time)).toBeInTheDocument()
        expect(screen.getByTestId(messageStates[message.state].test_id)).toBeInTheDocument()
    })

    it('renders image message correctly', () => {
        const message = {
            type: messageTypes.IMAGE,
            content: 'image-url.jpg',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 'sent'
        }

        renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        const image = screen.getByAltText('message')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'image-url.jpg')
    })

    it('renders audio message correctly', () => {
        const message = {
            type: messageTypes.AUDIO,
            content: 'audio-url.mp3',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 0
        }

        const { container } = renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        // Check if waveform container exists
        expect(container.querySelector('.waveform')).toBeInTheDocument()

        // Check if play button is rendered initially
        const playButton = screen.getByTestId('font-awesome-icon')
        expect(playButton).toHaveAttribute('data-icon', 'play')

        // Check if time display is rendered
        expect(screen.getByText(/01:00/)).toBeInTheDocument()
    })

    it('shows correct message status for different states', () => {
        Object.entries(messageStates).forEach(([state, stateData]) => {
            const message = {
                type: messageTypes.TEXT,
                content: 'Hello',
                senderId: 'authenticatedUserId',
                time: '10:00',
                state
            }

            renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)
            expect(screen.getByTestId(stateData.test_id)).toBeInTheDocument()
        })
    })

    it('does not show message status for receiver', () => {
        const message = {
            type: messageTypes.TEXT,
            content: 'Hello',
            senderId: 'other123',
            time: '10:00',
            state: 'sent'
        }

        const { container } = renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        const statusElement = container.querySelector('.message-status')
        expect(statusElement).not.toBeInTheDocument()
    })

    it('shows context menu on right click', async () => {
        const message = {
            type: messageTypes.TEXT,
            content: 'Hello',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 0
        }

        renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        const messageElement = screen.getByText('Hello').closest('.message')
        fireEvent.contextMenu(messageElement)

        expect(screen.getByText('Reply')).toBeInTheDocument()
        expect(screen.getByText('Forward')).toBeInTheDocument()
        expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('calls onDelete when delete button is clicked', async () => {
        const message = {
            type: messageTypes.TEXT,
            content: 'Hello',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 0
        }

        renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        const messageElement = screen.getByText('Hello').closest('.message')
        fireEvent.contextMenu(messageElement)

        const deleteButton = screen.getByText('Delete')
        fireEvent.click(deleteButton)

        expect(mockOnDelete).toHaveBeenCalledWith(message)
    })

    it('calls onReply when reply button is clicked', () => {
        const message = {
            type: messageTypes.TEXT,
            content: 'Hello',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 0
        }

        renderWithModal(<ChatMessage message={message} onDelete={mockOnDelete} onReply={mockOnReply} />)

        const messageElement = screen.getByText('Hello').closest('.message')
        fireEvent.contextMenu(messageElement)

        const replyButton = screen.getByText('Reply')
        fireEvent.click(replyButton)

        expect(mockOnReply).toHaveBeenCalledWith(message)
    })

    it('applies correct CSS classes for sender and receiver messages', () => {
        // Test sender message
        const senderMessage = {
            type: messageTypes.TEXT,
            content: 'Sender message',
            senderId: 'authenticatedUserId',
            time: '10:00',
            state: 0
        }

        const { container: senderContainer } = renderWithModal(
            <ChatMessage message={senderMessage} onDelete={mockOnDelete} onReply={mockOnReply} />
        )

        expect(senderContainer.querySelector('.message')).toHaveClass('sender')

        // Test receiver message
        const receiverMessage = {
            type: messageTypes.TEXT,
            content: 'Receiver message',
            senderId: 'otherUserId',
            time: '10:00',
            state: 0
        }

        const { container: receiverContainer } = renderWithModal(
            <ChatMessage message={receiverMessage} onDelete={mockOnDelete} onReply={mockOnReply} />
        )

        expect(receiverContainer.querySelector('.message')).toHaveClass('reciever')
    })
})
