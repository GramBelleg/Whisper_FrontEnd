import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useModal } from "@/contexts/ModalContext"; // adjust the path as needed
import { downloadBlob } from "@/services/blobs/blob"; // adjust the path as needed
import { setStoryPrivacySettings } from "@/services/storiesservice/setStoryVisibility"; // adjust the path as needed
import SingleStory from "@/components/SingleStory/SingleStory";

vi.mock("@/services/blobs/blob", () => ({
    downloadBlob: vi.fn(),
}));

vi.mock("@/services/storiesservice/setStoryVisibility", () => ({
    setStoryPrivacySettings: vi.fn(),
}));

vi.mock("@/contexts/ModalContext", () => ({
    useModal: vi.fn(() => ({
        openModal: vi.fn(),
        closeModal: vi.fn(),
    })),
}));

// Example story data for tests
const story = {
    id: 0,
    content: "ahmed",
    media: "/api/container1/61730546732593.string?sv=2024-11-04&se=2024-11-12T18%3A08%3A47Z&sr=b&sp=r&sig=McIinnmuVtRCb4Z1fPR3xqoKMT7kgwf%2FJrj5B81cE2I%3D",
    type: "video/mp4",
    likes: 12,
    date: new Date(),
    viewed: true,
    privacy: "everyone",
};

describe("SingleStory tests", () => {
    it("renders the story content", async () => {
        downloadBlob.mockResolvedValueOnce({ blob: new Blob() });
    
        render(<SingleStory story={story}/>);
    
        // Check if the story content renders correctly
        expect(screen.getByText("ahmed")).toBeInTheDocument();
    });

    it("doesn't show content ", async () => {
        downloadBlob.mockReturnValueOnce(new Promise(() => {})); // Simulate pending download
        
        render(<SingleStory story={null}/>);
        const storyContent = screen.queryByText(/ahmed/i); // Adjust to check for story content or specific text
        expect(storyContent).toBeNull(); // Ensure 'ahmed' is not rendered
    });

    it("opens dropdown menu when clicking the three dots", async () => {
        downloadBlob.mockResolvedValueOnce({ blob: new Blob() });

        render(<SingleStory story={story} />);

        // Click on the three dots
        const threeDotsButton = screen.getByLabelText("Options");
        fireEvent.click(threeDotsButton);

        // Check if the dropdown menu appears with correct options
        expect(screen.getByText("Add")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
        expect(screen.getByText("Who Can See My Story?")).toBeInTheDocument();
    });

    it("calls handleAddNewStoryClick when clicking 'Add' in dropdown", async () => {
        downloadBlob.mockResolvedValueOnce({ blob: new Blob() });

        const handleAddNewStoryClick = vi.fn();
        render(<SingleStory story={story} handleAddNewStoryClick={handleAddNewStoryClick}/>);

        const threeDotsButton = screen.getByLabelText("Options");
        fireEvent.click(threeDotsButton);

        // Click on the 'Add' button
        const addButton = screen.getByText("Add");
        fireEvent.click(addButton);

        // Assert the file input is triggered
        expect(handleAddNewStoryClick).toHaveBeenCalled();

    });

    it("calls handleDeleteStory when clicking 'Delete' in dropdown", async () => {
        downloadBlob.mockResolvedValueOnce({ blob: new Blob() });

        const onDeleteStory = vi.fn();
        render(<SingleStory story={story} onDeleteStory={onDeleteStory} />);

        const threeDotsButton = screen.getByLabelText("Options");
        fireEvent.click(threeDotsButton);

        // Click on the 'Delete' button
        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        // Assert that onDeleteStory was called
        expect(onDeleteStory).toHaveBeenCalled();
    });

    it("opens visibility dropdown when clicking 'Who Can See My Story?'", async () => {

        render(<SingleStory story={story} />);

        const threeDotsButton = screen.getByLabelText("Options");
        fireEvent.click(threeDotsButton);

        // Click on the 'Who Can See My Story?' button
        const visibilityButton = screen.getByText("Who Can See My Story?");
        fireEvent.click(visibilityButton);

        // Check if visibility options are displayed
        expect(screen.getByText("Everyone")).toBeInTheDocument();
        expect(screen.getByText("My Contacts")).toBeInTheDocument();
        expect(screen.getByText("No One")).toBeInTheDocument();
    });

    it("choose correctly 'Who Can See My Story?'", async () => {

        render(<SingleStory story={story} />);

        const threeDotsButton = screen.getByLabelText("Options");
        fireEvent.click(threeDotsButton);

        // Click on the 'Who Can See My Story?' button
        const visibilityButton = screen.getByText("Who Can See My Story?");
        fireEvent.click(visibilityButton);

        // Check if visibility options are displayed
        const everyone = screen.getByLabelText("Everyone"); // or use getByValue if you prefer

        // Simulate a click event on the radio button
        fireEvent.click(everyone);

        // Now, the radio button should be checked
        expect(everyone).toBeChecked();

        // Check if visibility options are displayed
        const contacts = screen.getByLabelText("My Contacts"); // or use getByValue if you prefer

        // Simulate a click event on the radio button
        fireEvent.click(contacts);

        // Now, the radio button should be checked
        expect(contacts).toBeChecked();
    });
});

