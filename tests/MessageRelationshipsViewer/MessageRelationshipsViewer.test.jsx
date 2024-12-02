import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { messageTypes } from '@/services/sendTypeEnum'
import { describe, expect, test, vi } from 'vitest'
import MessageRelationshipsViewer from '@/components/ChatMessage/MessageRelationshipsViewer'

// Mock the SVG import
vi.mock('@/assets/images/no-profile.svg?react', () => {
  return {
    default: () => <svg data-testid="no-profile-icon" />,
  }
})

describe('MessageRelationshipsViewer', () => {
  test('renders forwarded message with profile picture', () => {
    const message = {
      forwarded: true,
      forwardedFrom: {
        profilePic: 'http://example.com/profile.jpg',
        userName: 'John Doe',
      },
    }

    render(<MessageRelationshipsViewer message={message} />)

    expect(screen.getByText('Forwarded From')).toBeInTheDocument()
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', message.forwardedFrom.profilePic)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  test('renders forwarded message with no profile picture', () => {
    const message = {
      forwarded: true,
      forwardedFrom: {
        profilePic: null,
        userName: 'Jane Doe',
      },
    }

    render(<MessageRelationshipsViewer message={message} />)

    expect(screen.getByText('Forwarded From')).toBeInTheDocument()
    expect(screen.getByTestId('no-profile-icon')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  test('renders parent message with text content', () => {
    const message = {
      parentMessage: {
        senderName: 'Alice',
        content: 'Hello, world!',
        type: messageTypes.TEXT,
      },
    }

    render(<MessageRelationshipsViewer message={message} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Hello, world!')).toBeInTheDocument()
  })

  test('renders parent message with non-text content', () => {
    const message = {
      parentMessage: {
        senderName: 'Bob',
        type: messageTypes.IMAGE,
      },
    }

    render(<MessageRelationshipsViewer message={message} />)

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
  })

  test('renders nothing when message has no related content', () => {
    const message = {}

    const { container } = render(<MessageRelationshipsViewer message={message} />)
    expect(container).toBeEmptyDOMElement()
  })
})
