import { render, screen } from "@testing-library/react";
import LastMessage from "../../src/components/LastMessage/LastMessage";
import WhisperDB from "@/services/indexedDB/whisperDB";

vi.mock('@/hooks/useAuth', () => ({
    default: () => ({
      user: { name: 'CurrentUser' }, 
    }),
}));

vi.mock('@/contexts/WhisperDBContext', () => ({
    default: () => ({
        dbRef: new WhisperDB(), 
    }),
}));

describe("LastMessage component", () => {
    it("renders DraftedMessage when myChat.draftMessageContent has value", () => {
        const myChat = {
            draftMessageContent: "ahmed",
            lastMessage: "Drafted message"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("ahmed")).toBeInTheDocument();
    });

    it("renders DeletedMessage when myChat.messageState is 3", () => {
        const myChat = {
            drafted: false,
            messageState: 3,
            sender: "John"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("John deleted this message")).toBeInTheDocument();
    });

    it("renders TextMessage for 'text' message type", () => {
        const myChat = {
            drafted: false,
            messageState: 1,
            messageType: "text",
            lastMessage: "Hello World"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders ImageMessage for 'image' message type", () => {
        const myChat = {
            drafted: false,
            messageState: 1,
            attachmentName: "elsa.jpg",
            messageType: "image"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("Image")).toBeInTheDocument();
    });

    it("renders VideoMessage for 'video' message type", () => {
        const myChat = {
            drafted: false,
            messageState: 1,
            attachmentName: "elsa.mp4",
            messageType: "video"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("Video")).toBeInTheDocument();
    });

    it("renders StickerMessage for 'sticker' message type", () => {
        const myChat = {
            drafted: false,
            messageState: 1,
            messageType: "sticker"
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.getByText("Sticker")).toBeInTheDocument();
    });


    it("does not render AwaitingJoinMessage if participantKeys are complete", () => {
        const myChat = {
            type: "DM",
            participantKeys: ["key1", "key2"]
        };
        render(<LastMessage myChat={myChat} />);
        expect(screen.queryByText("Awaiting join")).not.toBeInTheDocument();
    });
});
