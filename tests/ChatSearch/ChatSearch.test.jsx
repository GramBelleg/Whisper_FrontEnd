import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatSearch from '@/components/ChatSearch/ChatSearch';
import { vi } from 'vitest';
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';
import { useChat } from '@/contexts/ChatContext';
import { messagesLocalSearch } from '@/services/search/search';

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
    useStackedNavigation: vi.fn(),
}));
vi.mock('@/contexts/ChatContext', () => ({
    useChat: vi.fn(),
}));
vi.mock('@/services/search/search', () => ({
    messagesLocalSearch: vi.fn(),
}));
vi.mock('@/components/SearchBar/SearchBar', () => ({
    default: vi.fn(({ searchQuery, setSearchQuery, onEnter }) => (
        <div>
            <input
                data-testid="search-input-test"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onEnter()}
            />
        </div>
    )),
}));

vi.mock('@/components/ChatMessage/ChatMessage', () => ({
    default: ({ message }) => <div>{message.text}</div>,
}));

describe('ChatSearch Component', () => {
    const mockOnClose = vi.fn();
    const mockHandleSearchMessageClick = vi.fn();
    const mockSearchChat = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useStackedNavigation.mockReturnValue({ push: vi.fn() });
        useChat.mockReturnValue({
            searchChat: mockSearchChat,
            currentChat: { id: '123', type: 'DM' },
        });
    });

    it('renders the ChatSearch component', () => {
        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );

        expect(screen.getByText('Chat Search')).toBeInTheDocument();
        expect(screen.getByTestId('search-input-test')).toBeInTheDocument();
    });

    it('handles text filter and triggers search', async () => {
        mockSearchChat.mockResolvedValue([
            { id: '1', text: 'Sample text message', extension: null },
        ]);

        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );

        const searchBar = screen.getByTestId('search-input-test');
        fireEvent.change(searchBar, { target: { value: 'Sample' } });
        fireEvent.keyPress(searchBar, { key: 'Enter', code: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(mockSearchChat).toHaveBeenCalledWith('Sample');
        });

        expect(screen.getByText('Sample text message')).toBeInTheDocument();
    });

    it('handles photo filter and local search', async () => {
        mockSearchChat.mockResolvedValue([
            { id: '2', text: '', sender: { userName: 'User1', id: '123' }, extension: 'image/png' },
        ]);
    
        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );
    
        const photoButton = screen.getByText('Photo');
        fireEvent.click(photoButton);
    
        const searchBar = screen.getByTestId("search-input-test");
        fireEvent.change(searchBar, { target: { value: 'image' } });
        fireEvent.keyPress(searchBar, { key: 'Enter', code: 'Enter', charCode: 13 });
    
        await waitFor(() => {
            expect(mockSearchChat).toHaveBeenCalledWith('image');
        });
    
        await waitFor(() => {
            const resultElements = screen.getAllByTestId('message-search-result');
            expect(resultElements.length).toBe(1);
        });
    });    

    it('handles no search results', async () => {
        mockSearchChat.mockResolvedValue([]);

        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );

        const searchBar = screen.getByTestId('search-input-test');
        fireEvent.change(searchBar, { target: { value: 'nonexistent' } });
        fireEvent.keyPress(searchBar, { key: 'Enter', code: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(screen.getByText('No results found')).toBeInTheDocument();
        });
    });

    it('calls onClose on close button click', async () => {
        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );

        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('calls handleSearchMessageClick on search result click', async () => {
        mockSearchChat.mockResolvedValue([
            { id: '1', text: 'Message to click', extension: null },
        ]);

        render(
            <ChatSearch onClose={mockOnClose} handleSearchMessageClick={mockHandleSearchMessageClick} />
        );

        const searchBar = screen.getByTestId('search-input-test');
        fireEvent.change(searchBar, { target: { value: 'Message' } });
        fireEvent.keyPress(searchBar, { key: 'Enter', code: 'Enter', charCode: 13 });

        await waitFor(() => {
            fireEvent.click(screen.getByText('Message to click'));
            expect(mockHandleSearchMessageClick).toHaveBeenCalledWith('1');
        });
    });
});
