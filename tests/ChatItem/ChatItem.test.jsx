import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatItem from "../../src/components/ChatItem/ChatItem";
import { assert, vi } from "vitest";
import { ChatContext } from "@/contexts/ChatContext";

describe("This test is for the ChatItem component", () => {
    const mockStandaloneChat = {
        id: 1,
        senderId: 2,
        type: "text",
        unreadMessageCount: 3,
        lastMessageId: 4,
        lastMessage: "Hello",
        sender: "Alice",
        lastSeen: "now",
        muted: false,
        media: false,
        messageState: "read",
        messageTime: "2024-10-10 10:00:12",
        messageType: "text",
        tagged: false,
        group: false,
        story: false,
        othersId: 5,
        profilePic: "https://example.com/profile.jpg",
    };

    const chooseChatMock = vi.fn();

    const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
        return render(
            <ChatContext.Provider value={providerProps}>
                {ui}
            </ChatContext.Provider>,
            renderOptions
        );
    };

    it("renders the chat item with correct sender name and message time", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={mockStandaloneChat} />, {
            providerProps: { selectChat: chooseChatMock }
        });

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("10:10:2024")).toBeInTheDocument();
    });

    it("renders the chat item with yesterday if that was the time", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const messageTime = yesterday.toISOString().slice(0, 19).replace('T', ' ');

        renderWithContext(<ChatItem index={0} standaloneChat={{...mockStandaloneChat, messageTime}} />, {
            providerProps: { selectChat: chooseChatMock }
        });
        expect(screen.getByText("Yesterday")).toBeInTheDocument();
    });

    it("renders the chat item with hour if the time was today", () => {
        const today = new Date();
        const hours = String(today.getHours()).padStart(2, '0'); // Ensure two-digit hour
        const minutes = String(today.getMinutes()).padStart(2, '0'); // Ensure two-digit minutes
        const expectedTime = `${hours}:${minutes}`;

        renderWithContext(
            <ChatItem
                index={0}
                standaloneChat={{ ...mockStandaloneChat, messageTime: today.toISOString() }}
            />, {
                providerProps: { selectChat: chooseChatMock }
            }
        );

        // Check if the displayed time matches
        expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });

    it("renders the chat item with muted to check icon", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{...mockStandaloneChat, muted:true}} />, {
            providerProps: { selectChat: chooseChatMock }
        });

        const mutedDiv = document.querySelector(".muted-bell")
        expect(mutedDiv).toBeInTheDocument();
    });

    it("calls chooseChat with the correct ID when clicked outside Info", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={mockStandaloneChat} />, {
            providerProps: { selectChat: chooseChatMock }
        });

        const chatItem = screen.getByTestId("chat-item");
        fireEvent.click(chatItem);

        expect(chooseChatMock).toHaveBeenCalledWith(expect.objectContaining({ id: mockStandaloneChat.id }));
    });

    it("renders the correct tick icon based on messageState `sent`", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{ ...mockStandaloneChat, messageState: "sent" }} />, {
            providerProps: { selectChat: chooseChatMock }
        });
        
        const readTicks = document.querySelector(".sent-ticks");
        expect(readTicks).toBeInTheDocument();
    });

    it("renders the correct tick icon based on messageState `delivered`", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{ ...mockStandaloneChat, messageState: "delivered" }} />, {
            providerProps: { selectChat: chooseChatMock }
        });
        
        const readTicks = document.querySelector(".delivered-ticks");
        expect(readTicks).toBeInTheDocument();
    });

    it("renders the correct tick icon based on messageState `read`", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{ ...mockStandaloneChat, messageState: "read" }} />, {
            providerProps: { selectChat: chooseChatMock }
        });
        
        const readTicks = document.querySelector(".read-ticks");
        expect(readTicks).toBeInTheDocument();
    });

    it("displays the overflow class when name length exceeds max length", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{ ...mockStandaloneChat, sender: "VeryLongSenderNameExceedingLimit" }} />, {
            providerProps: { selectChat: chooseChatMock }
        });

        expect(screen.getByText(/VeryLongSend.../i)).toBeInTheDocument();
    });

    it("renders the chat item with muted and long name", () => {
        renderWithContext(<ChatItem index={0} standaloneChat={{...mockStandaloneChat, muted:true, sender: "VeryLongSenderNameExceedingLimit"}} />, {
            providerProps: { selectChat: chooseChatMock }
        });

        const mutedDiv = document.querySelector(".muted-bell")
        expect(mutedDiv).toBeInTheDocument();

        const style = getComputedStyle(mutedDiv);
        expect(parseInt(style._length)).toBeGreaterThan(5); // Ensure it is there

        expect(screen.getByText(/VeryLongSend.../i)).toBeInTheDocument();
    });
});
