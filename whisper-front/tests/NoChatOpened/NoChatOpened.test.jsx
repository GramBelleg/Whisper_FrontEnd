import { render, screen } from "@testing-library/react";
import NoChatOpened from "../../src/components/NoChatOpened/NoChatOpened";
import { vi } from "vitest";


describe("No Chat Opened  component", () => {

    beforeEach(() => {
        // Mock console.log for handleClick
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.log
        vi.restoreAllMocks();
    });

    it("renders the component", () => {
        render(<NoChatOpened />);
        expect(screen.getByText("Whisper")).toBeInTheDocument();
        expect(screen.getByText("The ultimate way to connect")).toBeInTheDocument();
    });
})