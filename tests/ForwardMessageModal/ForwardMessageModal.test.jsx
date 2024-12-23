import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, prettyDOM } from '@testing-library/react';
import { useModal } from '@/contexts/ModalContext';
import { useChat } from '@/contexts/ChatContext';
import { getChatsCleaned } from '@/services/chatservice/getChats';
import ForwardMessageModal from '@/components/Modals/ForwardMessageModal/ForwardMessageModal';

// Mock the dependencies
vi.mock('@/contexts/ModalContext');
vi.mock('@/contexts/ChatContext');
vi.mock('@/services/chatservice/getChats');

describe('ForwardMessageModal', () => {
  const mockMessage = {
    content: 'Test message',
    type: 'text',
    media: null,
    extension: null,
    senderId: 'user123'
  };

  const mockChats = [
    {
      id: 'chat1',
      name: 'Test Chat 1',
      profilePic: '/test1.jpg',
      lastSeen: '2 hours ago',
      group: false
    },
    {
      id: 'chat2',
      name: 'Test Group',
      profilePic: '/test2.jpg',
      lastSeen: '1 hour ago',
      group: true
    }
  ];

  const mockSelectChat = vi.fn();
  const mockSendMessage = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock context hooks
    useModal.mockReturnValue({ closeModal: mockCloseModal });
    useChat.mockReturnValue({
      selectChat: mockSelectChat,
      sendMessage: mockSendMessage,
      currentChat: null
    });
    
    // Mock chat service
    getChatsCleaned.mockResolvedValue(mockChats);
  });

  it('renders without crashing', async () => {
    render(<ForwardMessageModal message={mockMessage} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('loads and displays chat list', async () => {
    render(<ForwardMessageModal message={mockMessage} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Chat 1')).toBeInTheDocument();
      expect(screen.getByText('Test Group')).toBeInTheDocument();
    });
  });

  it('handles chat search correctly', async () => {
    render(<ForwardMessageModal message={mockMessage} />);
    
    const searchInput = screen.getByPlaceholderText('Forward to...');
    fireEvent.change(searchInput, { target: { value: 'Group' } });
    
    await waitFor(() => {
      expect(getChatsCleaned).toHaveBeenCalledWith(
        expect.objectContaining({ keyword: 'Group' })
      );
    });
  });

  it('displays loading state while fetching chats', async () => {
    getChatsCleaned.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<ForwardMessageModal message={mockMessage} />);
    expect(screen.getByText('Loading chats...')).toBeInTheDocument();
  });

  it('handles chat selection and forwards message', async () => {

    render(<ForwardMessageModal message={mockMessage} />);
    
    
    await waitFor(() => {
      expect(screen.getByText(mockChats[0].name)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(mockChats[0].name));

    await waitFor(() => {
      expect(mockSelectChat).toHaveBeenCalledWith(mockChats[0]);
      expect(mockSendMessage).toHaveBeenCalledWith({
        chatId: mockChats[0].id,
        content: mockMessage.content,
        type: mockMessage.type,
        media: mockMessage.media,
        extension: mockMessage.extension,
        sentAt: expect.any(String),
        forwarded: true,
        forwardedFromUserId: mockMessage.senderId
      });
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it('handles error state when loading chats fails', async () => {
    getChatsCleaned.mockRejectedValueOnce(new Error('Failed to load chats'));
    
    render(<ForwardMessageModal message={mockMessage} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load chats')).toBeInTheDocument();
    });
  });

  it('displays no results message when chat list is empty', async () => {
    getChatsCleaned.mockResolvedValueOnce([]);
    
    render(<ForwardMessageModal message={mockMessage} />);
    
    await waitFor(() => {
      expect(screen.getByText('No chats found')).toBeInTheDocument();
    });
  });

  it('displays group indicator for group chats', async () => {
    render(<ForwardMessageModal message={mockMessage} />);
    
    await waitFor(() => {
      const groupChat = screen.getByText('Test Group');
      const groupChatItem = groupChat.closest('.chat-item');
      expect(groupChatItem.querySelector('.group-indicator')).toBeInTheDocument();
    });
  });

  it('displays last seen for individual chats', async () => {
    render(<ForwardMessageModal message={mockMessage} />);
    
    await waitFor(() => {
      expect(screen.getByText('Last seen 2 hours ago')).toBeInTheDocument();
    });
  });
});