import LastMessage from "@/components/LastMessage/LastMessage";
import TextMessage from "@/components/TextMessage/TextMessage";
import { render, screen } from "@testing-library/react";


describe("Testing LastMessage", () => {

    it("renders TextMessage when messageType is text", () => {
        const myChat = {
            drafted: false,
            messageState: 1,
            messageType: "text",
            lastMessage: "This is a text message",
        };
        render(<LastMessage myChat={myChat} index={0} />);
        expect(screen.getByText("This is a text message")).toBeInTheDocument();
    });

    it("renders DeletedMessage when messageState is 3", () => {
        const myChat = {
            drafted: false,
            messageState: 3,
            messageType: "text",
            senderId: "12345",
        };
        render(<LastMessage myChat={myChat} index={0} />);
        expect(screen.getByText("12345 deleted this message")).toBeInTheDocument();
    });

    it("renders DraftedMessage when drafted is true", () => {
        const myChat = {
            drafted: true,
            lastMessage: "Drafted message content",
        };
        render(<LastMessage myChat={myChat} index={0} />);
        expect(screen.getByText("Drafted message content")).toBeInTheDocument();
    });
})