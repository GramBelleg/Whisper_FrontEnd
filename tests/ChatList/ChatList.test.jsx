import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ChatList from '@/components/ChatList/ChatList';
import { ChatContext, ChatProvider } from '@/contexts/ChatContext';
import { WhisperDBProvider } from '@/contexts/WhisperDBContext';
import { ModalProvider } from '@/contexts/ModalContext';

describe('ChatList Component', () => {
    const mockChooseChat = vi.fn(); // Mock chooseChat function
    const mockChatList = [
        {
            id: 1,
            senderId: -1,
            type: "DM",
            unreadMessageCount: 10,
            lastMessageId: 1,
            lastMessage: "Hello",
            sender: "him",
            lastSeen: "10:00:10",
            isMuted: false,
            media: false,
            messageState: "read",
            messageTime: "",
            messageType: "text",
            tagged: false,
            group: false,
            story: false,
            othersId: 1,
            profilePic: '',
        },
        {
            id: 2,
            senderId: -1,
            type: "DM",
            unreadMessageCount: 0,
            lastMessageId: 1,
            lastMessage: "7ambola",
            sender: "ziad",
            lastSeen: "10:00:10",
            isMuted: false,
            media: false,
            messageState: "delivered",
            messageTime: "",
            messageType: "text",
            tagged: false,
            group: false,
            story: false,
            othersId: 1,
            profilePic: '',
        }
    ];

    const renderWithChatContext = (ui) => {
        return render(
            <WhisperDBProvider>
                <ChatProvider>
                    <ModalProvider>
                        {ui}
                    </ModalProvider>
                    
                </ChatProvider>
            </WhisperDBProvider>
        );
    };

    beforeEach(() => {
        renderWithChatContext(<ChatList chatList={mockChatList} />, {
            providerProps: { selectChat: mockChooseChat }
        });
    });
    
    it('renders the correct number of ChatItems', () => {
        setTimeout(() => {
            const chatItems = screen.getAllByTestId('chat-item');
            expect(chatItems.length).toBe(2);
        }, [5000])
        
    });
    
    it('updates hovered index on mouse enter and leave', () => {
        setTimeout(() => {
            const firstChatItem = screen.getAllByTestId('chat-item')[0];
            const secondChatItem = screen.getAllByTestId('chat-item')[1];

            fireEvent.mouseEnter(firstChatItem);
            expect(screen.getByText('Hello')).toHaveClass('hovered'); 

            fireEvent.mouseLeave(firstChatItem);
            expect(screen.getByText('Hello')).not.toHaveClass('hovered'); 

            fireEvent.mouseEnter(secondChatItem);
            expect(screen.getByText('7ambola')).toHaveClass('hovered');
        }, [5000])
         
    });
});