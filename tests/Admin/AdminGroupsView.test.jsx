import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AllGroups from '../../src/components/AllGroups/AllGroups';
import { toggleGroupFilter } from '@/services/adminservice/adminActions';

const mockPop = vi.fn();
const mockSetReload = vi.fn();
const mockDbRef = {
  current: {
    filterGroup: vi.fn(),
    unFilterGroup: vi.fn(),
    updateGroup: vi.fn(),
  },
};
vi.mock('@/services/adminservice/adminActions', () => ({
  toggleGroupFilter: vi.fn(),
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
  useStackedNavigation: () => ({
    pop: mockPop,
  }),
}));

vi.mock('@/contexts/WhisperDBContext', () => ({
  useWhisperDB: () => ({
    dbRef: mockDbRef,
  }),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div data-testid="mock-icon"></div>,
}));

describe('AllGroups Component', () => {
  const mockGroups = [
    { chatId: 1, name: 'Group 1', filter: false, picture: null, blobData: null },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    toggleGroupFilter.mockResolvedValue(true);
  });

  it('renders groups correctly', async () => {
    render(<AllGroups groups={mockGroups} setReload={mockSetReload} />);
    expect(screen.getByText('Group 1')).toBeInTheDocument();
  });

  it('filters groups based on search input', () => {
    render(<AllGroups groups={mockGroups} setReload={mockSetReload} />);
    const searchInput = screen.getByPlaceholderText('Search groups...');
    fireEvent.change(searchInput, { target: { value: 'Group 1' } });
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
  });

  it('opens context menu and applies filter action', async () => {
    render(<AllGroups groups={mockGroups} setReload={mockSetReload} />);
    
    const groupItem = screen.getByText('Group 1');
    fireEvent.contextMenu(groupItem);
    
    const filterButton = await screen.findByTestId('toggle-filter-button');
    expect(filterButton).toBeInTheDocument();
    
    fireEvent.click(filterButton);
    expect(mockDbRef.current.filterGroup).toHaveBeenCalledWith(mockGroups[0].chatId);
  });

  it('handles unfilter action after applying filter', async () => {
    render(<AllGroups groups={mockGroups} setReload={mockSetReload} />);
  
    const groupItem = screen.getByText('Group 1');
    fireEvent.contextMenu(groupItem);
  
    const filterButton = await screen.findByTestId('toggle-filter-button');
    fireEvent.click(filterButton); 
  
    await waitFor(() => {
      expect(mockDbRef.current.filterGroup).toHaveBeenCalledWith(mockGroups[0].chatId);
    });
  
    fireEvent.contextMenu(groupItem); 
    const unfilterButton = await screen.findByTestId('toggle-filter-button');
    fireEvent.click(unfilterButton);  
  
    await waitFor(() => {
      expect(mockDbRef.current.unFilterGroup).toHaveBeenCalledWith(mockGroups[0].chatId);
    });
  });
});
