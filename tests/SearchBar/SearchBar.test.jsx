import { render, screen, fireEvent} from  '@testing-library/react';
import SearchBar from '@/components/SearchBar/SearchBar';
import {  vi } from "vitest";



describe("Search Bar component test", () => {

    beforeEach(() => {
        // Mock console.log for handleClick
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        // Restore console.log
        vi.restoreAllMocks();
    });

    it("Search Bar should render correctly", () => {
        render(<SearchBar />);
        expect(screen.getByTestId("search-input-test")).toBeInTheDocument();
    })
})