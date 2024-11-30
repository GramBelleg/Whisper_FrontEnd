import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchSingleChat from '@/components/SearchSingleChat/SearchSingleChat';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useChat } from '@/contexts/ChatContext';

// Mocking the ChatContext
vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn(),
}));

describe('SearchSingleChat Component', () => {
  beforeEach(() => {
    // Mocking the `searchChat` function
    useChat.mockReturnValue({
      searchChat: vi.fn(async (query) => {
        if (query === 'test') {
          return [{ content: 'Test Result 1' }, { content: 'Test Result 2' }];
        }
        return [];
      }),
    });
  });

  it('renders the search icon by default', () => {
    render(<SearchSingleChat />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it('toggles the search bar when the search icon is clicked', () => {
    render(<SearchSingleChat />);
    const searchIcon = screen.getByTestId("search-icon");

    // Initially, the search bar should not be visible
    expect(screen.queryByTestId('search-bar-test')).not.toBeInTheDocument();

    // Click to open the search bar
    fireEvent.click(searchIcon);
    expect(screen.getByTestId('search-bar-test')).toBeInTheDocument();

    // Click to close the search bar
    const closeIcon = screen.getByTestId('close-icon');
    fireEvent.click(closeIcon);
    expect(screen.queryByTestId('search-bar-test')).not.toBeInTheDocument();
  });

  it('renders SearchBar and calls props correctly', () => {
    const mockHandleQueryChange = vi.fn();
    const mockHandleSearchClick = vi.fn();

    render(
      <SearchBar
        handleQueryChange={mockHandleQueryChange}
        handleSearchClick={mockHandleSearchClick}
      />
    );

    const searchIcon = screen.getByTestId('search-bar-test');
    const input = screen.getByTestId('search-input-test');

    // Verify the input and search icon are rendered
    expect(searchIcon).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    // Simulate clicking the search icon
    fireEvent.click(searchIcon);
    expect(mockHandleSearchClick).toHaveBeenCalledTimes(1);

    // Simulate typing into the input
    fireEvent.change(input, { target: { value: 'example query' } });
    expect(mockHandleQueryChange).toHaveBeenCalledTimes(1);
  });

  it('displays search results when typing in the search bar', async () => {
    render(<SearchSingleChat />);
    const searchIcon = screen.getByTestId('search-icon');

    // Open the search bar
    fireEvent.click(searchIcon);

    // Type into the search bar
    const input = screen.getByTestId('search-input-test');
    fireEvent.change(input, { target: { value: 'test' } });

    // Wait for the search results to appear
    expect(await screen.findByText('Test Result 1')).toBeInTheDocument();
    expect(screen.getByText('Test Result 2')).toBeInTheDocument();
  });

  it('shows "No results found" when no search results are returned', async () => {
    render(<SearchSingleChat />);
    const searchIcon = screen.getByTestId('search-icon');

    // Open the search bar
    fireEvent.click(searchIcon);

    // Type into the search bar with a query that returns no results
    const input = screen.getByTestId('search-input-test');
    fireEvent.change(input, { target: { value: 'nonexistent' } });

    // Wait for the "No results found" message to appear
    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });
});
