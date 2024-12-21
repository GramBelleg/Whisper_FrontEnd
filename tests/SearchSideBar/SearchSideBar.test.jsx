import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWhisperDB } from '@/contexts/WhisperDBContext';
import { useChat } from '@/contexts/ChatContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { chatsGlobalSearch, messagesGlobalSearch } from '@/services/search/search';
import SearchSideBar from '@/components/SearchSideBar/SearchSideBar';
import { useModal } from '@/contexts/ModalContext';
import AuthContext from '@/contexts/AuthContext';
import useAuth from '@/hooks/useAuth';  

// Mock the modules
vi.mock('@/contexts/WhisperDBContext');
vi.mock('@/contexts/ChatContext');
vi.mock('@/contexts/SidebarContext');
vi.mock('@/services/search/search');
vi.mock('@/contexts/ModalContext');
vi.mock('@/hooks/useAuth', () => ({
    default: () => ({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
      }
    })
  }));


describe('SearchSideBar', () => {
    // Mock data
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

    const mockDbRef = {
        current: {
            getChat: vi.fn().mockResolvedValue(mockChat),
            getMessage: vi.fn().mockResolvedValue(mockMessage),
            getAllDMs: vi.fn().mockResolvedValue([mockChat]),
            getAllImages: vi.fn().mockResolvedValue([]),
            getAllVideos: vi.fn().mockResolvedValue([])
        }
    };

    const mockAuthContext = {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        }
      };

    const renderWithProviders = (ui) => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                {ui}
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Setup context mocks
        useWhisperDB.mockReturnValue({ dbRef: mockDbRef });
        useChat.mockReturnValue({
            selectChat: vi.fn(),
            handlePinnedClick: vi.fn(),
            searchChat: vi.fn().mockResolvedValue([mockMessage])
        });
        useSidebar.mockReturnValue({ setActivePage: vi.fn() });
        useModal.mockReturnValue({
            openModal: vi.fn(),
            openConfirmationModal: vi.fn()
        });

        // Setup search function mocks
        chatsGlobalSearch.mockResolvedValue([mockChat]);
        messagesGlobalSearch.mockResolvedValue([mockMessage]);
    });

    it('renders search bar and filters correctly', () => {
        render(<SearchSideBar />);
        
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        
        const filters = ['Chats', 'Text', 'Image', 'Video'];
        filters.forEach(filter => {
            expect(screen.getByText(filter)).toBeInTheDocument();
        });
    });

    it('toggles filter state when clicked', () => {
        render(<SearchSideBar />);
        
        const chatsFilter = screen.getByText('Chats').parentElement;
        fireEvent.click(chatsFilter);
        expect(chatsFilter).toHaveClass('active');
        
        fireEvent.click(chatsFilter);
        expect(chatsFilter).not.toHaveClass('active');
    });

    it('performs chat search when Chats filter is active', async () => {
        render(<SearchSideBar />);
        
        // Activate Chats filter and perform search
        const chatsFilter = screen.getByText('Chats').parentElement;
        fireEvent.click(chatsFilter);
        
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(() => {
        expect(chatsGlobalSearch).toHaveBeenCalledWith('test query');
        expect(mockDbRef.current.getChat).toHaveBeenCalled();
        });
    });

    it('performs message search with text filter', async () => {
        render(<SearchSideBar />);
        
        // Activate Text filter
        const textFilter = screen.getByText('Text').parentElement;
        fireEvent.click(textFilter);
        
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'test message' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(() => {
        expect(messagesGlobalSearch).toHaveBeenCalledWith('test message', 'TEXT');
        expect(mockDbRef.current.getMessage).toHaveBeenCalled();
        });
    });

    it('handles message click correctly', async () => {
        const { selectChat, handlePinnedClick } = useChat();
        const { setActivePage } = useSidebar();
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
              <SearchSideBar />
            </AuthContext.Provider>
          );
        
        // Activate Text filter and perform search
        fireEvent.click(screen.getByText('Text').parentElement);
        
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(async () => {
        const messageResult = await screen.findByText('Test message');
        fireEvent.click(messageResult);
        
        expect(setActivePage).toHaveBeenCalledWith('chat');
        expect(selectChat).toHaveBeenCalled();
        expect(handlePinnedClick).toHaveBeenCalled();
        });
    });

    it('handles image search correctly', async () => {
        render(<SearchSideBar />);
        
        // Activate Image filter
        fireEvent.click(screen.getByText('Image').parentElement);
        
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'image search' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(() => {
        expect(messagesGlobalSearch).toHaveBeenCalledWith('image search', 'IMAGE');
        expect(mockDbRef.current.getAllImages).toHaveBeenCalled();
        });
    });

    it('handles video search correctly', async () => {
        render(<SearchSideBar />);
        
        // Activate Video filter
        fireEvent.click(screen.getByText('Video').parentElement);
        
        const searchInput = screen.getByRole('textbox');
        fireEvent.change(searchInput, { target: { value: 'video search' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(() => {
        expect(messagesGlobalSearch).toHaveBeenCalledWith('video search', 'VIDEO');
        expect(mockDbRef.current.getAllVideos).toHaveBeenCalled();
        });
    });
});