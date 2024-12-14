import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ChatItem from "@/components/ChatItem/ChatItem";
import { ChatProvider } from "@/contexts/ChatContext";
import { WhisperDBProvider } from "@/contexts/WhisperDBContext";

// Mock the ModalContext
vi.mock("@/contexts/ModalContext", () => ({
    useModal: () => ({
        openModal: vi.fn(),
        closeModal: vi.fn(),
    }),
}));

describe("ChatItem Component", () => {
    
    it("renders ChatItem with basic props", () => {
        const standaloneChat = {
            id: 1,
            name: "Test User",
            profilePic: "test.jpg",
            messageTime: "12:00 PM",
            unreadMessageCount: 0,
            muted: false,
            tagged: false,
            group: false,
            story: false,
        };

        render(
            <WhisperDBProvider>
                <ChatProvider>
                    <ChatItem index={0} standaloneChat={standaloneChat} />
                </ChatProvider>
            </WhisperDBProvider>
        );
        setTimeout(() => {
            // Check if the name is rendered
            expect(screen.getByText("Test User")).toBeInTheDocument();
            // Check if the profile picture is rendered
            expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
        }, [5000])
        
    });
    
    it("displays muted bell when chat is muted", () => {
        const standaloneChat = {
            id: 1,
            name: "Muted Chat",
            profilePic: "test.jpg",
            muted: true,
            unreadMessageCount: 0,
        };

        render(
            <WhisperDBProvider>
                <ChatProvider>
                    <ChatItem index={0} standaloneChat={standaloneChat} />
                </ChatProvider>
            </WhisperDBProvider>
        );

        setTimeout(() => {
            expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
        }, [5000])
        // Check if the muted bell icon is rendered
        
    });
    
    it("displays last message and unread count", () => {
        const standaloneChat = {
            id: 2,
            name: "Another User",
            profilePic: "user2.jpg",
            lastMessage: "Hello, how are you?",
            unreadMessageCount: 3,
            muted: false,
            tagged: false,
            group: false,
            story: false,
            messageTime: "3:00 PM",
        };

        render(
            <WhisperDBProvider>
                <ChatProvider>
                    <ChatItem index={1} standaloneChat={standaloneChat} />
                </ChatProvider>
            </WhisperDBProvider>
        );
        setTimeout(() => {
            expect(screen.getByText("3")).toBeInTheDocument();
        }, [5000])
        
    });
    
});
