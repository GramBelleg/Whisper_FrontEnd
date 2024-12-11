import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { useChat } from "@/contexts/ChatContext";
import ChatHeader from "@/components/ChatHeader/ChatHeader";

// Mock the useChat context
vi.mock("@/contexts/ChatContext", () => ({
    useChat: vi.fn(),
}));

describe("ChatHeader", () => {
    const mockCurrentChat = {
        id: "chat123",
        name: "Test Chat",
        type: "GROUP",
        profilePic: "profile-pic-url",
        lastSeen: "10:00 AM",
        members: [{ id: 1 }, { id: 2 }],
        isMuted: false,
        isAdmin: true,
    };

    const mockLeaveGroup = vi.fn();
    const mockHandleMute = vi.fn();
    const mockHandleUnMute = vi.fn();


    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the chat header correctly", () => {
        useChat.mockReturnValue({
            currentChat: mockCurrentChat,
            leaveGroup: mockLeaveGroup,
            handleMute: mockHandleMute,
            handleUnMute: mockHandleUnMute,
            });
        render(<ChatHeader />);

        expect(screen.getByText(mockCurrentChat.name)).toBeInTheDocument();
        expect(screen.getByText(`Members ${mockCurrentChat.members.length}`)).toBeInTheDocument();
        expect(screen.getByAltText(mockCurrentChat.name)).toHaveAttribute("src", mockCurrentChat.profilePic);
    });

    it("calls handleMute when mute button is clicked", async () => {
        useChat.mockReturnValue({
            currentChat: {...mockCurrentChat, isMuted: true},
            leaveGroup: mockLeaveGroup,
            handleMute: mockHandleMute,
            handleUnMute: mockHandleUnMute,
            });
        render(<ChatHeader />);

        fireEvent.click(screen.getByTestId("test-ellipses"))
        fireEvent.click(screen.getByText(/Mute Chat/i));
    });

    it("calls handleUnMute when unmute button is clicked", async () => {
        useChat.mockReturnValueOnce({
        currentChat: { ...mockCurrentChat, isMuted: true },
        leaveGroup: mockLeaveGroup,
        handleMute: mockHandleMute,
        handleUnMute: mockHandleUnMute,
        });

        render(<ChatHeader />);
        fireEvent.click(screen.getByTestId("test-ellipses"))
        fireEvent.click(screen.getByText(/Unmute Chat/i));
        expect(mockHandleUnMute).toHaveBeenCalledWith(mockCurrentChat.id, mockCurrentChat.type);
    });

    it("renders delete button for admin users", () => {
        render(<ChatHeader />);
        fireEvent.click(screen.getByTestId("test-ellipses"))
        expect(screen.getByText(/Delete group/i)).toBeInTheDocument();
    });

    it("does not render delete button for non-admin users", () => {
        useChat.mockReturnValueOnce({
        currentChat: { ...mockCurrentChat, isAdmin: false },
        leaveGroup: mockLeaveGroup,
        handleMute: mockHandleMute,
        handleUnMute: mockHandleUnMute,
        });

        render(<ChatHeader />);
        expect(screen.queryByText(/Delete group/i)).not.toBeInTheDocument();
    });
});
