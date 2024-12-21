import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useChat } from '@/contexts/ChatContext';
import useAuth from '@/hooks/useAuth';
import AuthContext from '@/contexts/AuthContext';
import { useWhisperDB } from '@/contexts/WhisperDBContext';

import ThreadsBar from '@/components/Threads/ThreadsBar';
import ChatMessage from '@/components/ChatMessage/ChatMessage';
import ChatActions from '@/components/ChatActions/ChatActions';
import { ModalProvider } from '@/contexts/ModalContext';

// Mock the dependencies
vi.mock('@/contexts/WhisperDBContext');

vi.mock('@/contexts/ChatContext');
vi.mock('@/hooks/useAuth', () => ({
    default: () => ({
        user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
        }
    })
}));


// Mock ChatMessage component
vi.mock('@/components/ChatMessage/ChatMessage', () => ({
  default: ({ message }) => (
    <div data-testid={`chat-message-${message.id}`}>
      {message.content}
    </div>
  )
}));

describe('ThreadsBar', () => {
    const mockChat = {
        id: '123',
        title: 'Test Chat',
        lastMessage: 'Hello world'
    };

    const mockMessage = {
        id: '456',
        chatId: '123',
        content: 'Test message',
        timestamp: new Date().toISOString(),
        type: 'text'
    };
    const mockThreadMessage = {
        id: 'thread-1',
        replies: [
        {
            id: 'reply-1',
            content: 'First reply',
            senderId: 'test-user-id',
        },
        {
            id: 'reply-2',
            content: 'Second reply',
            senderId: 'other-user-id',
        }
        ]
    };
    const mockDbRef = {
            current: {
                getChat: vi.fn().mockResolvedValue(mockChat),
                getMessage: vi.fn().mockResolvedValue(mockMessage),
                getAllDMs: vi.fn().mockResolvedValue([mockChat]),
                getAllImages: vi.fn().mockResolvedValue([]),
                getAllVideos: vi.fn().mockResolvedValue([])
            }
        };

    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useWhisperDB.mockReturnValue({ dbRef: mockDbRef });
        // Setup chat context mock
        useChat.mockReturnValue({
        threadMessage: mockThreadMessage
        });

        // Mock setTimeout
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const renderWithProviders = (ui) => {
        const mockAuthContext = {
        user: {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com'
        }
        };

        return render(
        <AuthContext.Provider value={mockAuthContext}>
            <ModalProvider>
            {ui}
            </ModalProvider>
        </AuthContext.Provider>
        );
    };

    it('renders properly with thread messages', () => {
        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        // Check basic structure
        expect(screen.getByText('Thread')).toBeInTheDocument();
        expect(screen.getByTestId('close-button')).toBeInTheDocument();

        // Check if replies are rendered
        mockThreadMessage.replies.forEach(reply => {
        expect(screen.getByTestId(`chat-message-${reply.id}`)).toBeInTheDocument();
        });
    });

    it('handles close button click with animation', async () => {
        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        // Click close button
        fireEvent.click(screen.getByTestId('close-button'));

        // Check if isVisible state is updated (should trigger animation)
        const threadsBar = screen.getByText('Thread').closest('div.fixed');
        expect(threadsBar).toHaveClass('translate-x-[200%]');

        // Fast-forward timers
        vi.advanceTimersByTime(300);

        // Verify onClose was called after animation
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('aligns messages correctly based on sender', () => {
        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        // Get message containers
        const messages = screen.getAllByTestId(/chat-message/);
        
        // Check first message (from current user) alignment
        const firstMessageContainer = messages[0].parentElement;
        expect(firstMessageContainer).toHaveClass('justify-start');

        // Check second message (from other user) alignment
        const secondMessageContainer = messages[1].parentElement;
        expect(secondMessageContainer).toHaveClass('justify-end');
    });

    it('sets initial visibility on mount', () => {
        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        const threadsBar = screen.getByText('Thread').closest('div.fixed');
        expect(threadsBar).toHaveClass('translate-x-0');
    });

    it('renders empty thread correctly', () => {
        useChat.mockReturnValue({
        threadMessage: { replies: [] }
        });

        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        // Should still render basic structure
        expect(screen.getByText('Thread')).toBeInTheDocument();

        // But no messages
        expect(screen.queryByTestId(/chat-message/)).not.toBeInTheDocument();
    });

    it('updates when threadMessage changes', async () => {
        const { rerender } = renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        // Initial render
        expect(screen.getAllByTestId(/chat-message/).length).toBe(2);

        // Update threadMessage
        const newThreadMessage = {
        id: 'thread-1',
        replies: [
            ...mockThreadMessage.replies,
            {
            id: 'reply-3',
            content: 'New reply',
            senderId: 'test-user-id',
            }
        ]
        };

        useChat.mockReturnValue({
            threadMessage: newThreadMessage
        });

        // Rerender with new thread message
        rerender(
            <AuthContext.Provider value={{ user: { id: 'test-user-id' } }}>
                <ModalProvider>
                    <ThreadsBar onClose={mockOnClose} />
                </ModalProvider>
            </AuthContext.Provider>
        );

        // Should now have 3 messages
        expect(screen.getAllByTestId(/chat-message/).length).toBe(3);
    });

    it('logs threadMessage changes', async () => {
        const consoleSpy = vi.spyOn(console, 'log');
        
        renderWithProviders(<ThreadsBar onClose={mockOnClose} />);

        expect(consoleSpy).toHaveBeenCalledWith(mockThreadMessage);
    });
});