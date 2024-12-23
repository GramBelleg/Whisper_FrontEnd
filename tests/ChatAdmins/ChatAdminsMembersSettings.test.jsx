import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GroupMembers from '@/components/GroupMembers/GroupMembers';
import noUser from '@/assets/images/no-user.png';
import { useChat } from '@/contexts/ChatContext';
import { updateGroupMemberPermissions } from '@/services/chatservice/updateChatMemberPermissions';

vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn(),
}));

vi.mock('@/services/chatservice/updateChatMemberPermissions', () => ({
  updateGroupMemberPermissions: vi.fn()
}));

vi.mock('@/hooks/useAuth', () => ({
  default: () => ({
    user: { id: '999' }
  }),
  useAuth: () => ({
    user: { id: '999' }
  })
}));

describe('GroupMembers Component - Admins Interactions', () => {
  const mockMembers = [
    { id: '1', userName: 'John Doe', isAdmin: false },
    { id: '2', userName: 'Jane Smith', isAdmin: true },
  ];
  const mockPermissions = {
    '1': {
      canPost: false,
      canEdit: false,
      canDelete: false,
      canDownload: false
    }
  };

  let mockHandleGetMembersPermissions;
  let mockHandleAddAdmin;
  let mockHandleRemoveFromChat;
  let mockHandlePermissionsToggle;

  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockPermissions = {
      '1': {
        canPost: false,
        canEdit: false,
        canDelete: false,
        canDownload: false
      }
    };

    mockHandleGetMembersPermissions = vi.fn().mockResolvedValue(mockPermissions);
    mockHandleAddAdmin = vi.fn();
    mockHandleRemoveFromChat = vi.fn();
    mockHandlePermissionsToggle = vi.fn();
    useChat.mockReturnValue({
      handleGetMembersPermissions: mockHandleGetMembersPermissions,
      currentChat: { id: 'chat1' }
    });
  });

  it('shows chevron icon only for non-admin members when user is admin', () => {
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type={"group"}
      />
    );

    const chevrons = screen.getAllByTestId('chevron-icon');
    expect(chevrons).toHaveLength(1);
  });

  it('displays permission menu when chevron is clicked', async () => {
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    expect(screen.getByLabelText('Can Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Can Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Can Delete')).toBeInTheDocument();
    expect(screen.getByLabelText('Can Download')).toBeInTheDocument();
    expect(screen.getByText('Promote to admin')).toBeInTheDocument();
    expect(screen.getByText('Remove from group')).toBeInTheDocument();
  });

  it('initializes checkboxes with correct permissions', async () => {
    const initialPermissions = {
      '1': {
        canPost: true,
        canEdit: false,
        canDelete: false,
        canDownload: true
      }
    };


    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={initialPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Can Post')).toBeChecked();
      expect(screen.getByLabelText('Can Edit')).not.toBeChecked();
      expect(screen.getByLabelText('Can Delete')).not.toBeChecked();
      expect(screen.getByLabelText('Can Download')).toBeChecked();
    });
  });

  it('handles permission toggle correctly', async () => {
    const mockPermissions = {
      '1': {
        canPost: false,
        canEdit: false,
        canDelete: false,
        canDownload: false
      }
    };
    

    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    const canEditCheckbox = screen.getByLabelText('Can Edit');
    fireEvent.click(canEditCheckbox);

    expect(mockHandlePermissionsToggle).toHaveBeenCalledWith('canEdit', '1');

  });

  it('closes permission menu when clicking outside', async () => {
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    expect(screen.getByLabelText('Can Post')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByLabelText('Can Post')).not.toBeInTheDocument();
    });
  });

  it('handles promoting member to admin correctly', async () => {
    const mockAddAdmin = vi.fn();
    
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    const promoteButton = screen.getByText('Promote to admin');
    fireEvent.click(promoteButton);

    expect(mockAddAdmin).toHaveBeenCalledTimes(1);
    expect(mockAddAdmin).toHaveBeenCalledWith('1');
  });

  it('handles removing member from group correctly', async () => {
    const mockRemoveFromChat = vi.fn();
    
    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={mockPermissions}
        type="group"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    const removeButton = screen.getByText('Remove from group');
    fireEvent.click(removeButton);

    expect(mockRemoveFromChat).toHaveBeenCalledTimes(1);
    expect(mockRemoveFromChat).toHaveBeenCalledWith(mockMembers[0]);
  });
  
  it('initializes checkboxes with correct permissions for channels', async () => {
    const initialPermissionsChannels = {
      '1': {
        canComment: false,
        canDownload: false
      }
    };


    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={true}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        permissionsState={initialPermissionsChannels}
        type="channel"
      />
    );

    await waitFor(() => {
      const chevron = screen.getAllByTestId('chevron-icon')[0];
      fireEvent.click(chevron);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Can Comment')).not.toBeChecked();
      expect(screen.getByLabelText('Can Download')).not.toBeChecked();

    });
  });
  it('no options if not admin', async () => {
    const initialPermissionsChannels = {
      '1': {
        canComment: false,
        canDownload: false
      }
    };

    useChat.mockReturnValue({
      handleGetMembersPermissions: vi.fn().mockResolvedValue(initialPermissionsChannels),
      currentChat: { id: 'chat1' }
    });

    render(
      <GroupMembers
        filteredMembers={mockMembers}
        handleQueryChange={() => {}}
        amIAdmin={false}
        handleAddAmin={mockHandleAddAdmin}
        handleRemoveFromChat={mockHandleRemoveFromChat}
        handlePermissionsToggle={mockHandlePermissionsToggle}
        type="channel"
      />
    );

    await waitFor(() => {
      const chevron = screen.queryByTestId('chevron-icon');
      expect(chevron).not.toBeInTheDocument();
    });

  });
});
