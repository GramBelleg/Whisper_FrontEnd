import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ChatItem from '@/components/ChatItem/ChatItem';
import ChatList from '@/components/ChatList/ChatList';

// Mock ChatItem component to isolate testing


describe('ChatList Component', () => {
    const mockChooseChat = vi.fn(); // Mock chooseChat function

    beforeEach(() => {
        // Mock data for chat list
        const mockChatList = [
            {
                id: 1,
                senderId: -1,
                type: "DM",
                unreadMessageCount: 10,
                lastMessageId: 1,
                lastMessage:"Hello",
                sender:"him",
                lastSeen: "10:00:10",
                muted: false,
                media: false,
                messageState:"read",
                messageTime:"",
                messageType:"text",
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
                lastMessage:"7ambola",
                sender:"ziad",
                lastSeen: "10:00:10",
                muted: false,
                media: false,
                messageState:"delivered",
                messageTime:"",
                messageType:"text",
                tagged: false,
                group: false,
                story: false,
                othersId: 1,
                profilePic: '',
            }
        ];

        render(<ChatList chatList={mockChatList} chooseChat={mockChooseChat} />);
    });

    it('renders the correct number of ChatItems', () => {
        const chatItems = screen.getAllByTestId('chat-item');
        expect(chatItems.length).toBe(2); // Ensure the number of chat items matches the mock data
    });

    it('updates hovered index on mouse enter and leave', () => {
        const firstChatItem = screen.getAllByTestId('chat-item')[0];
        const secondChatItem = screen.getAllByTestId('chat-item')[1];

        // Mouse enter on the first chat item
        fireEvent.mouseEnter(firstChatItem);
        expect(screen.getByText('him')).toHaveClass('hovered'); // Check if first item has 'hovered' class

        // Mouse leave on the first chat item
        fireEvent.mouseLeave(firstChatItem);
        expect(screen.getByText('him')).not.toHaveClass('hovered'); // Check if first item no longer has 'hovered' class

        // Mouse enter on the second chat item
        fireEvent.mouseEnter(secondChatItem);
        expect(screen.getByText('ziad')).toHaveClass('hovered'); // Check if second item has 'hovered' class
    });

    it('calls chooseChat when a chat item is clicked', () => {
        const chatItems = screen.getAllByTestId('chat-item');

        // Simulate clicking the first chat item
        fireEvent.click(chatItems[0]);
        expect(mockChooseChat).toHaveBeenCalled(); // Ensure chooseChat is called
    });
});
