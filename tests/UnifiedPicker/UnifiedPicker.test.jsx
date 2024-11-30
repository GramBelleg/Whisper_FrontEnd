import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnifiedPicker from "@/components/UnifiedPicker/UnifiedPicker";
import CustomGifPicker from "@/components/CustomGifPicker/CustomGifPicker";
import CustomStickersPicker from "@/components/CustomStickersPicker/CustomStickersPicker";

vi.mock("@/components/CustomGifPicker/CustomGifPicker", () => ({
    default: vi.fn(({ onGifSelect }) => (
      <div data-testid="gifs-picker" onClick={() => onGifSelect("mockGifData")}>
        GIF Picker Component
      </div>
    )),
  }));
  
  vi.mock("@/components/CustomStickersPicker/CustomStickersPicker", () => ({
    default: vi.fn(({ handleStickerClick }) => (
      <div
        data-testid="stickers-picker"
        onClick={() => handleStickerClick("mockStickerBlob", "mockStickerUrl")}
      >
        Stickers Picker Component
      </div>
    )),
  }));
  
  

describe("UnifiedPicker", () => {
    const onGifSelectMock = vi.fn();
    const onStickerSelectMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the picker icon and toggles the picker on click", () => {
    render(<UnifiedPicker onGifSelect={onGifSelectMock} onStickerSelect={onStickerSelectMock} />);
    const pickerIcon = screen.getByRole("img", { hidden: true });
    expect(pickerIcon).toBeInTheDocument();

    fireEvent.click(pickerIcon);
    expect(screen.getByText("GIF")).toBeInTheDocument();

    fireEvent.click(pickerIcon);
    expect(screen.queryByText("GIF")).not.toBeInTheDocument();
  });

  it("displays GIF picker by default and switches to Stickers picker", () => {
    render(<UnifiedPicker onGifSelect={onGifSelectMock} onStickerSelect={onStickerSelectMock} />);
    fireEvent.click(screen.getByRole("img", { hidden: true }));

    expect(screen.getByText("GIF")).toBeInTheDocument();

    const stickersTabButton = screen.getByTestId("button-stickers");
    fireEvent.click(stickersTabButton);

    expect(screen.queryByTestId("gifs-picker")).toBeNull();
    expect(screen.getByTestId("stickers-picker")).toBeInTheDocument();
  });

  it("closes the picker when clicking outside of it", async () => {
    render(<UnifiedPicker onGifSelect={onGifSelectMock} onStickerSelect={onStickerSelectMock} />);
    fireEvent.click(screen.getByRole("img", { hidden: true }));
    expect(screen.getByText("GIF")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText("GIF")).not.toBeInTheDocument();
    });
  });

  it("calls `onGifSelect` when a GIF is selected", async () => {
    render(<UnifiedPicker onGifSelect={onGifSelectMock} onStickerSelect={onStickerSelectMock} />);
    fireEvent.click(screen.getByRole("img", { hidden: true })); // Open the picker
  
    // Verify the mock component rendered and simulate GIF selection
    expect(screen.getByTestId("gifs-picker")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("gifs-picker"));
  
    // Verify the `onGifSelect` callback was called with correct arguments
    expect(onGifSelectMock).toHaveBeenCalledWith("mockGifData");
  });
  

  it("calls `onStickerSelect` when a sticker is selected", () => {
    render(<UnifiedPicker onGifSelect={onGifSelectMock} onStickerSelect={onStickerSelectMock} />);
    fireEvent.click(screen.getByRole("img", { hidden: true }));
    
    // Click the tab to activate the stickers picker
    fireEvent.click(screen.getByTestId("button-stickers"));
  
    // Verify the mock component rendered and simulate sticker selection
    expect(screen.getByTestId("stickers-picker")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("stickers-picker"));
  
    // Verify the `onStickerSelect` callback was called with correct arguments
    expect(onStickerSelectMock).toHaveBeenCalledWith("mockStickerBlob", "mockStickerUrl");
  });
  
});
