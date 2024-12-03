import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useModal } from "@/contexts/ModalContext";
import Info from "@/components/Info/Info";

vi.mock("@/contexts/ModalContext", () => ({
    useModal: vi.fn(),
}));

describe("Info Component", () => {
    let openModalMock, closeModalMock;

    beforeEach(() => {
        openModalMock = vi.fn();
        closeModalMock = vi.fn();
        useModal.mockReturnValue({ openModal: openModalMock, closeModal: closeModalMock });
    });

    it("renders the Info component", () => {
        render(<Info index={1} group={false} muted={false} onMute={vi.fn()} onUnMute={vi.fn()} />);
        const infoIcon = document.querySelector(".info");
        expect(infoIcon).toBeInTheDocument();
    });
    
    it("toggles dropdown visibility on click", () => {
        render(<Info index={1} group={false} muted={false} onMute={vi.fn()} onUnMute={vi.fn()} />);
        const infoIcon = document.querySelector(".info");

        fireEvent.click(infoIcon);
        let dropdown = screen.getByRole("list");
        expect(dropdown).toBeInTheDocument();

        fireEvent.click(infoIcon);
        expect(dropdown).not.toBeVisible();
    });
    
    it("calls the onMute function when mute is selected", async () => {
        const onMuteMock = vi.fn();
        render(<Info index={1} group={false} muted={false} onMute={onMuteMock} onUnMute={vi.fn()} />);

        const infoIcon = document.querySelector(".info");

        fireEvent.click(infoIcon);

        const muteOption = screen.getByText("Mute notifications");
        fireEvent.click(muteOption);

        await waitFor(() => {
            expect(openModalMock).toHaveBeenCalled();
        });
    });
    
    it("calls the onUnMute function when unmute is selected", () => {
        const onUnMuteMock = vi.fn();
        render(<Info index={1} group={false} muted={true} onMute={vi.fn()} onUnMute={onUnMuteMock} />);

        const infoIcon = document.querySelector(".info");
        fireEvent.click(infoIcon);

        const unMuteOption = screen.getByText("Unmute notifications");
        fireEvent.click(unMuteOption);

        expect(onUnMuteMock).toHaveBeenCalled();
    });
    
    it("renders additional options for groups", () => {
        render(<Info index={1} group={true} muted={false} onMute={vi.fn()} onUnMute={vi.fn()} />);

        const infoIcon = document.querySelector(".info");
        fireEvent.click(infoIcon);

        const leaveGroupOption = screen.getByText("Leave group");
        expect(leaveGroupOption).toBeInTheDocument();
    });
    
    it("positions dropdown correctly", async () => {
        render(<Info index={1} group={false} muted={false} onMute={vi.fn()} onUnMute={vi.fn()} />);

        const infoIcon = document.querySelector(".info");
        fireEvent.click(infoIcon);

        const dropdown = document.querySelector(".dropdown");

        // Simulate a window resize or a positioning update
        fireEvent.resize(window);

        await waitFor(() => {
            expect(dropdown).toHaveStyle({
                top: "100%",
            });
        });
    });
});
