import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SampleHome from '@/components/SampleHome/SampleHome';
import { getChatsCleaned, getUserForChat } from '@/services/chatservice/getChats';
import { describe, it, beforeEach, afterEach, vi } from 'vitest'; // Changed from jest to vitest
import photoMock from "../../public/assets/images/Grambell.png";

// Mocking components
vi.mock('../../components/ChatPage/ChatPage', () => {
    return {
        default: ({ chooseChat }) => (
            <div data-testid="chatpage-component" onClick={() => chooseChat(1)}>ChatPage Component</div>
        )
    };
});

vi.mock('../../components/SingleChatSection/SingleChatSection', () => {
    return {
        default: ({ selectedUser }) => (
            <div data-testid="singlechat-component">SingleChatSection Component for {selectedUser?.name}</div>
        )
    };
});

vi.mock('../../ButtonsBar/ButtonsBar', () => () => <div data-tesstid="">ButtonsBar Component</div>);

vi.mock('../../NoChatOpened/NoChatOpened', () => () => <div>NoChatOpened Component</div>);

// Mocking services
vi.mock('@/services/chatservice/getChats');
vi.mock('@/services/chatservice/getMessagesForChat');

describe('Sample Home Component', () => {

    const mockChatList = [
        {
            id: 1,
            lastMessage: {
                content: 'Hello!',
                createdAt: '2024-11-11T17:05:32Z',
                expiresAfter: null,
                forwarded: null,
                parentMessageId: null,
                pinned: false,
                selfDestruct: false,
                senderId: 1,
                type: 'text',
                id: 1,
            },
            type: 'group',
            othersId: 2,
            media: null,
            story: null,
            muted: false,
            profilePic: photoMock,
            userName: 'User 1',
        },
        {
            id: 2,
            lastMessage: {
                content: 'Hello From the Other Side',
                createdAt: '2024-08-10T17:05:32Z',
                expiresAfter: 5,
                forwarded: false,
                parentMessageId: null,
                pinned: false,
                selfDestruct: false,
                senderId: 3,
                type: 'text',
                id: 2,
            },
            type: 'DM',
            othersId: 3,
            media: null,
            story: null,
            muted: false,
            profilePic: photoMock,
            userName: 'User 3',
        },
    ];

    const mockCurrentUser = {
        userId: 'user2',
        correspondingChatId: 1,
        name: 'User 1',
        profilePic: photoMock,
        lastSeen: '2024-11-11 17:05:32',
    };

    beforeEach(() => {
        getChatsCleaned.mockResolvedValue(mockChatList.map(chat => ({
            id: chat.id,
            lastMessage: chat.lastMessage.content,
            messageTime: chat.lastMessage.createdAt.slice(0, 19).replace("T", " "),
            expiresAfter: chat.lastMessage.expiresAfter,
            forwarded: chat.lastMessage.forwarded !== null ? chat.lastMessage.forwarded : false,
            parentMessageId: chat.lastMessage.parentMessageId,
            pinned: chat.lastMessage.pinned,
            selfDestruct: chat.lastMessage.selfDestruct,
            senderId: chat.lastMessage.senderId,
            messageType: chat.lastMessage.type,
            lastMessageId: chat.lastMessage.id,
            type: chat.type,
            othersId: chat.othersId,
            media: chat.lastMessage.media !== null ? chat.media : false,
            story: chat.story !== null ? chat.story : false,
            muted: chat.muted !== null ? chat.muted : false,
            profilePic: chat.profilePic !== null ? chat.profilePic : 'noUser',
            unreadMessageCount: 0,
            sender: chat.userName,
        })));

        getUserForChat.mockImplementation((id) => (id === 1 ? mockCurrentUser : null));
    });

    afterEach(() => {
        vi.clearAllMocks(); // Changed from jest to vitest
    });

    it('renders without crashing', () => {
        render(<SampleHome />);
        expect(screen.getByText('ButtonsBar Component')).toBeInTheDocument();
        expect(screen.getByTestId('chatpage-component')).toBeInTheDocument();
    });
    /*
    it('displays loading state initially and then renders chat list after fetch', async () => {
        render(<SampleHome />);

        // Initially displays loading indicator
        expect(screen.queryByText('NoChatOpened Component')).toBeInTheDocument();

        // Wait for chats to load
        await waitFor(() => expect(getChatsCleaned).toHaveBeenCalledTimes(1));
        expect(screen.getByTestId('chatpage-component')).toBeInTheDocument();
    });

    it('handles errors when fetching chats', async () => {
        getChatsCleaned.mockRejectedValueOnce(new Error('Failed to fetch chats'));

        render(<SampleHome />);
        await waitFor(() => expect(getChatsCleaned).toHaveBeenCalledTimes(1));
        expect(screen.queryByTestId('chatpage-component')).not.toBeInTheDocument();
        expect(console.log).toHaveBeenCalledWith("Error: ", "Failed to fetch chats");
    });

    it('displays SingleChatSection after selecting a chat', async () => {
        render(<SampleHome />);

        await waitFor(() => expect(getChatsCleaned).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByTestId('chatpage-component'));

        await waitFor(() => {
            expect(getUserForChat).toHaveBeenCalledWith(1);
            expect(screen.getByText('SingleChatSection Component for User 1')).toBeInTheDocument();
        });
    });

    it('shows NoChatOpened if no user is selected for chat', async () => {
        getUserForChat.mockReturnValueOnce(null);

        render(<SampleHome />);
        await waitFor(() => expect(getChatsCleaned).toHaveBeenCalledTimes(1));
        fireEvent.click(screen.getByTestId('chatpage-component'));

        expect(screen.getByText('NoChatOpened Component')).toBeInTheDocument();
    });
    */
});
