import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { useChat } from "@/contexts/ChatContext";
import PinnedMessages from "@/components/PinnedMessages/PinnedMessages";

// Mock useChat context
vi.mock("@/contexts/ChatContext", () => ({
    useChat: vi.fn(),
}));

describe("PinnedMessages", () => {
    const mockPinnedMessages = [
        { messageId: "1", content: "First pinned message" },
        { messageId: "2", content: "Second pinned message" },
        { messageId: "3", content: "Third pinned message" },
    ];
    const mockUnPinMessage = vi.fn();
    const mockOnGoToMessage = vi.fn();

    beforeEach(() => {
        useChat.mockReturnValue({
        pinnedMessages: mockPinnedMessages,
        unPinMessage: mockUnPinMessage,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the pinned messages and indicators", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        expect(screen.getByText(mockPinnedMessages[0].content)).toBeInTheDocument();
    });

    it("cycles to the next pinned message on click", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        const container = screen.getByText(mockPinnedMessages[0].content).closest(".pinned-messages");
        fireEvent.click(container);

        // After the first click, the second message should be active
        expect(screen.getByText(mockPinnedMessages[1].content)).toBeInTheDocument();
    });

    it("cycles to the previous pinned message on right-click", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        const container = screen.getByText(mockPinnedMessages[0].content).closest(".pinned-messages");
        fireEvent.contextMenu(container); // Simulate right-click

        // After the first right-click, the last message should be active
        expect(screen.getByText(mockPinnedMessages[2].content)).toBeInTheDocument();
    });

    it("toggles the dropdown menu and triggers unpin", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        // Open the dropdown
        fireEvent.click(document.querySelector(".dropdown-icon"));

        // Verify dropdown is visible
        expect(screen.getByText(/unpin/i)).toBeInTheDocument();

        // Click "Unpin"
        fireEvent.click(screen.getByText(/unpin/i));
        expect(mockUnPinMessage).toHaveBeenCalledWith(mockPinnedMessages[0].messageId);
    });

    it("calls onGoToMessage when 'Go to Message' is clicked", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        // Open the dropdown
        fireEvent.click(document.querySelector(".dropdown-icon"));

        // Click "Go to Message"
        fireEvent.click(screen.getByText(/go to message/i));
        expect(mockOnGoToMessage).toHaveBeenCalledWith(mockPinnedMessages[0]);
    });

    it("closes dropdown when clicked outside", () => {
        render(<PinnedMessages onGoToMessage={mockOnGoToMessage} />);

        // Open the dropdown
        fireEvent.click(document.querySelector(".dropdown-icon"));

        // Click outside the dropdown
        fireEvent.mouseDown(document.body);

        // Verify dropdown is no longer visible
        expect(screen.queryByText(/unpin/i)).not.toBeInTheDocument();
    });
});
