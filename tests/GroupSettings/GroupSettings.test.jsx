import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GroupSettings from '@/components/GroupSettings/GroupSettings';
import { useChat } from '@/contexts/ChatContext';
import { useStackedNavigation } from '@/contexts/StackedNavigationContext/StackedNavigationContext';

vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn(),
}));

vi.mock('@/contexts/StackedNavigationContext/StackedNavigationContext', () => ({
  useStackedNavigation: vi.fn(),
}));

describe('GroupSettings Component', () => {
  let mockHandleGetGroupSettings;
  let mockSaveGroupSettings;
  let mockPop;

  beforeEach(() => {
    mockHandleGetGroupSettings = vi.fn().mockResolvedValue({ privacy: true, maxSize: 100 });
    mockSaveGroupSettings = vi.fn();
    mockPop = vi.fn();

    useChat.mockReturnValue({
      handleGetGroupSettings: mockHandleGetGroupSettings,
      saveGroupSettings: mockSaveGroupSettings,
    });

    useStackedNavigation.mockReturnValue({
      pop: mockPop,
    });
  });

  it('renders correctly with initial data from handleGetGroupSettings', async () => {
    render(<GroupSettings />);

    expect(screen.getByText('Group Settings')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockHandleGetGroupSettings).toHaveBeenCalled();
    });

    expect(screen.getByLabelText('Group Limit:')).toHaveValue(100);
    expect(screen.getByLabelText('Public')).toBeChecked();
  });

  it('handles privacy changes correctly', async () => {
    render(<GroupSettings />);
    await waitFor(() => {
      expect(mockHandleGetGroupSettings).toHaveBeenCalled();
    });

    const privateRadio = screen.getByTestId('private');
    fireEvent.click(privateRadio);
    expect(privateRadio).toBeChecked();

    const saveButton = screen.getByTestId('save-privacy');
    fireEvent.click(saveButton);

    expect(mockSaveGroupSettings).toHaveBeenCalledWith(null, 'Private');
  });

  it('handles group limit changes correctly', async () => {
    render(<GroupSettings />);
    await waitFor(() => {
      expect(mockHandleGetGroupSettings).toHaveBeenCalled();
    });

    const limitInput = screen.getByLabelText('Group Limit:');
    fireEvent.change(limitInput, { target: { value: '50' } });
    expect(limitInput).toHaveValue(50);

    const saveButton = screen.getByTestId('save-limit');
    fireEvent.click(saveButton);

    expect(mockSaveGroupSettings).toHaveBeenCalledWith(50, null);
    expect(mockPop).toHaveBeenCalled();
  });

  it('handles back navigation correctly', () => {
    render(<GroupSettings />);

    const backButton = screen.getByTestId('back');
    fireEvent.click(backButton);

    expect(mockPop).toHaveBeenCalled();
  });

});
