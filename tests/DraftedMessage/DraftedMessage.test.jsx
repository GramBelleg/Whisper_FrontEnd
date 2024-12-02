import DraftedMessage from "@/components/DraftedMessage/DraftedMessage";
import { render, screen } from "@testing-library/react";


describe("Drafted Message tests", () => {
    it("renders DraftedMessage component correctly", () => {
        render(<DraftedMessage message="This is a test draft message." />);
        expect(screen.getByText("Draft:")).toBeInTheDocument();
        expect(screen.getByText("This is a test draft message.")).toBeInTheDocument();
    });
    
    it("trims message longer than the maximum length", () => {
        const longMessage = "This is a very long draft message that exceeds the maximum length.";
        const expectedMessage = "This is a very long draft message that ...";
        render(<DraftedMessage message={longMessage} />);
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });

    it("does not trim message shorter than the maximum length", () => {
        const shortMessage = "Short message";
        render(<DraftedMessage message={shortMessage} />);
        expect(screen.getByText(shortMessage)).toBeInTheDocument();
    });

    it("handles empty message", () => {
        render(<DraftedMessage message="" />);
        expect(screen.getByText("Draft:")).toBeInTheDocument();
    });
})

