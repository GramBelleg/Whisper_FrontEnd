import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Info from "../../src/components/Info/Info";
import { vi } from "vitest";
import { useChat } from "@/contexts/ChatContext";

// Mock the context provider
vi.mock('@/contexts/ChatContext', () => ({
  useChat: vi.fn()
}));

describe("Info component", () => {
    const mockHandleMute = vi.fn();
    const mockHandleUnMute = vi.fn();
    const mockLeaveGroup = vi.fn();
    const mockHandleAction = vi.fn();
  
    beforeEach(() => {
        useChat.mockReturnValue({
            leaveGroup: mockLeaveGroup,
            handleMute: mockHandleMute,
            handleUnMute: mockHandleUnMute
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the component and toggles dropdown visibility", () => {
        const myChat = { id: "123", type: "DM", isMuted: false, isAdmin: false };

        render(<Info index={true} myChat={myChat} />);

        // Initially, dropdown should not be visible
        expect(screen.queryByText(/Mute notifications/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Unmute notifications/)).not.toBeInTheDocument();

        // Click on the info icon to toggle dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);
        
        // Dropdown should appear after click
        expect(screen.getByText(/Mute notifications/)).toBeInTheDocument();
    });

    it("handles mute and unmute actions", async () => {
        const myChat = { id: "123", type: "DM", isMuted: false, isAdmin: false };

        render(<Info index={true} myChat={myChat} />);

        // Click to open the dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);

        // Mute action should trigger handleMute
        fireEvent.click(screen.getByText(/Mute notifications/));

        await waitFor(() => {
            expect(mockHandleMute).toHaveBeenCalledWith(myChat.id, myChat.type);
        });

        // Change state to "muted" and test Unmute action
        myChat.isMuted = true;

        render(<Info index={true} myChat={myChat} />);

        // Click to open the dropdown again
        const divStart2 = document.querySelector(".info")
        fireEvent.click(divStart2);

        // Unmute action should trigger handleUnMute
        fireEvent.click(screen.getByText(/Unmute notifications/));

        await waitFor(() => {
            expect(mockHandleUnMute).toHaveBeenCalledWith(myChat.id, myChat.type);
        });
    });

    it("invokes leave group action", () => {
        const myChat = { id: "123", type: "group", isMuted: false, isAdmin: false };

        render(<Info index={true} myChat={myChat} />);

        // Open the dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);

        // Trigger Leave group action
        fireEvent.click(screen.getByText(/Leave group/));

        expect(mockLeaveGroup).toHaveBeenCalledWith(myChat.id);
    });

    it("hides dropdown on mouse leave", () => {
        const myChat = { id: "123", type: "group", isMuted: false, isAdmin: false };

        render(<Info index={true} myChat={myChat} />);

        // Click to open the dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);

        // Mouse leave should close the dropdown
        fireEvent.mouseLeave(screen.getByRole('list'));

        expect(screen.queryByText(/Mute notifications/)).not.toBeInTheDocument();
    });

    it("renders delete group option for admins", () => {
        const myChat = { id: "123", type: "group", isMuted: false, isAdmin: true };

        render(<Info index={true} myChat={myChat} />);

        // Open the dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);

        // Check for delete option
        expect(screen.getByText(/Delete group/)).toBeInTheDocument();
    });

    it("does not show delete group option for non-admins", () => {
        const myChat = { id: "123", type: "group", isMuted: false, isAdmin: false };

        render(<Info index={true} myChat={myChat} />);

        // Open the dropdown
        const divStart = document.querySelector(".info")
        fireEvent.click(divStart);

        // Check that the delete option is not visible
        expect(screen.queryByText(/Delete group/)).not.toBeInTheDocument();
    });
});
