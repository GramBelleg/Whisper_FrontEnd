import { render, screen, fireEvent } from "@testing-library/react";
import ButtonsBar from "../../src/components/ButtonsBar/ButtonsBar";
import { vi } from "vitest";

describe("ButtonsBar Component", () => {
    beforeEach(() => {
        // Mock console.log for handleClick
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.log
        vi.restoreAllMocks();
    });

    it("renders all icons and LogoutButton", () => {
        render(<ButtonsBar/>);

        // Verify that each icon is in the document
        expect(screen.getByTestId("chat-icon")).toBeInTheDocument();
        expect(screen.getByTestId("bookmark-icon")).toBeInTheDocument();
        expect(screen.getByTestId("starred-icon")).toBeInTheDocument();
        expect(screen.getByTestId("stories-icon")).toBeInTheDocument();
        expect(screen.getByTestId("settings-icon")).toBeInTheDocument();

        // Check that the LogoutButton is rendered
        expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
    });

    it("logs 'Chat clicked' when Chat icon is clicked", () => {
        render(<ButtonsBar/>);
        const chatIcon = screen.getByTestId("chat-icon");

        fireEvent.click(chatIcon);
        expect(console.log).toHaveBeenCalledWith("Chat clicked");
    });

    it("logs 'Bookmark clicked' when Bookmark icon is clicked", () => {
        render(<ButtonsBar/>);
        const bookmarkIcon = screen.getByTestId("bookmark-icon");

        fireEvent.click(bookmarkIcon);
        expect(console.log).toHaveBeenCalledWith("Bookmark clicked");
    });

    it("logs 'Starred clicked' when Starred icon is clicked", () => {
        render(<ButtonsBar/>);
        const starredIcon = screen.getByTestId("starred-icon");

        fireEvent.click(starredIcon);
        expect(console.log).toHaveBeenCalledWith("Starred clicked");
    });

    it("logs 'Stories clicked' when Stories icon is clicked", () => {
        render(<ButtonsBar/>);
        const storiesIcon = screen.getByTestId("stories-icon");

        fireEvent.click(storiesIcon);
        expect(console.log).toHaveBeenCalledWith("Stories clicked");
    });

    it("logs 'Settings clicked' when Settings icon is clicked", () => {
        render(<ButtonsBar/>);
        const settingsIcon = screen.getByTestId("settings-icon");

        fireEvent.click(settingsIcon);
        expect(console.log).toHaveBeenCalledWith("Settings clicked");
    });
});
