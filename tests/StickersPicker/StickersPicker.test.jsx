import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CustomStickersPicker from "@/components/CustomStickersPicker/CustomStickersPicker";
import { getStickers } from "@/services/chatservice/getStickers";

vi.mock("@/services/chatservice/getStickers", () => ({
  getStickers: vi.fn(),
}));

describe("CustomStickersPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays a loading state initially", () => {
    render(<CustomStickersPicker handleStickerClick={() => {}} />);
    expect(screen.getByText("Loading stickers...")).toBeInTheDocument();
  });

  it("renders stickers when fetched successfully", async () => {
    const mockStickers = [
      { imageUrl: "sticker1.png", blobName: "sticker1" },
      { imageUrl: "sticker2.png", blobName: "sticker2" },
    ];
    getStickers.mockResolvedValue(mockStickers);

    render(<CustomStickersPicker handleStickerClick={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading stickers...")).not.toBeInTheDocument();
      const stickerImages = screen.getAllByRole("img");
      expect(stickerImages.length).toBe(2);
      expect(stickerImages[0]).toHaveAttribute("src", "sticker1.png");
      expect(stickerImages[1]).toHaveAttribute("src", "sticker2.png");
    });
  });

  it("displays a message when no stickers are available", async () => {
    getStickers.mockResolvedValue([]);

    render(<CustomStickersPicker handleStickerClick={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading stickers...")).not.toBeInTheDocument();
      expect(screen.getByText("No stickers available")).toBeInTheDocument();
    });
  });

  it("handles fetch errors", async () => {
    getStickers.mockRejectedValue(new Error("Failed to fetch stickers"));

    render(<CustomStickersPicker handleStickerClick={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading stickers...")).not.toBeInTheDocument();
      expect(screen.getByText("No stickers available")).toBeInTheDocument();
    });
  });

  it("calls handleStickerClick when a sticker is clicked", async () => {
    const mockStickers = [
      { imageUrl: "sticker1.png", blobName: "sticker1" ,file: null},
      { imageUrl: "sticker2.png", blobName: "sticker2",file: null },
    ];
    const mockHandleStickerClick = vi.fn();
    getStickers.mockResolvedValue(mockStickers);

    render(<CustomStickersPicker handleStickerClick={mockHandleStickerClick} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading stickers...")).not.toBeInTheDocument();
    });

    const stickerImages = screen.getAllByTestId(/sticker-/i);
    fireEvent.click(stickerImages[0]);

    expect(mockHandleStickerClick).toHaveBeenCalledTimes(1);
    expect(mockHandleStickerClick).toHaveBeenCalledWith("sticker1", "sticker1.png",null);
  });
});
