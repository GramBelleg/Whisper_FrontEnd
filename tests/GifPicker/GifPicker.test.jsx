import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomGifPicker from "@/components/CustomGifPicker/CustomGifPicker";

vi.mock("gif-picker-react", () => ({
  __esModule: true,
  default: ({ onGifClick }) => (
    <div data-testid="gif-picker">
      <button
        data-testid="gif-item"
        onClick={() =>
          onGifClick({ url: "https://example.com/test.gif", id: "test-gif" })
        }
      >
        Select GIF
      </button>
    </div>
  ),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(["GIF DATA"], { type: "image/gif" })),
  })
);

describe("CustomGifPicker", () => {
  it("renders the GIF picker component", () => {
    render(<CustomGifPicker onGifSelect={() => {}} />);
    expect(screen.getByTestId("gif-picker")).toBeInTheDocument();
  });

  it("calls onGifSelect with a File object when a GIF is selected", async () => {
    const mockOnGifSelect = vi.fn();
    render(<CustomGifPicker onGifSelect={mockOnGifSelect} />);

    const gifItem = screen.getByTestId("gif-item");
    fireEvent.click(gifItem);

    await waitFor(() => {
      expect(mockOnGifSelect).toHaveBeenCalledTimes(1);
      const file = mockOnGifSelect.mock.calls[0][0];
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe("test-gif.gif");
      expect(file.type).toBe("image/gif");
    });
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Fetch failed"))
    );
    const mockOnGifSelect = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CustomGifPicker onGifSelect={mockOnGifSelect} />);

    const gifItem = screen.getByTestId("gif-item");
    fireEvent.click(gifItem);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error converting GIF to File:",
        expect.any(Error)
      );
      expect(mockOnGifSelect).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
