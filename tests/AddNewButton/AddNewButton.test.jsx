import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddNewButton from "@/components/AddNewButton/AddNewButton";
import { vi } from "vitest";

// Mock FontAwesomeIcon for testing simplicity
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props) => <svg data-testid="icon" {...props} />,
}));

describe("AddNewButton", () => {
    it("renders the button with a pencil icon", () => {
        render(<AddNewButton />);

        // Check if the button is in the document
        const buttonElement = screen.getByRole("button");
        expect(buttonElement).toBeInTheDocument();

        // Verify the icon is displayed
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("calls onClick when button is clicked", () => {
        const handleClick = vi.fn();
        render(<AddNewButton onClick={handleClick} />);

        const buttonElement = screen.getByRole("button");
        
        // Simulate a click event
        fireEvent.click(buttonElement);
        
        // Check if handleClick was called
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
