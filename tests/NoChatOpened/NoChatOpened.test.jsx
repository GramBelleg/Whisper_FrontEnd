import NoChatOpened from "@/components/NoChatOpened/NoChatOpened";
import { render, screen } from "@testing-library/react";


describe("NoChatOpened Component", () => {
    it("renders the component", () => {
        const { container } = render(<NoChatOpened />);
        
        const wrapper = container.querySelector(".no-chat-opened");
        expect(wrapper).toBeInTheDocument();
    });

    it("renders the NoChatOpenedLogo component inside", () => {
        const { container } = render(<NoChatOpened />);

        const wrapper = container.querySelector(".no-chat-opened");
        expect(wrapper).toBeInTheDocument();
        
        const svgLogo = container.querySelector("svg");
        expect(svgLogo).toBeInTheDocument();
    });
});
