import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useModal } from '@/contexts/ModalContext'
import { useStories } from '@/contexts/StoryContext'
import useAuth from '@/hooks/useAuth'
import { setStoryPrivacySettings } from '@/services/storiesservice/setStoryVisibility'
import SingleStory from '@/components/SingleStory/SingleStory'
import { useWhisperDB } from '@/contexts/WhisperDBContext';

// Mock all the required dependencies
vi.mock('@/contexts/ModalContext')
vi.mock('@/contexts/StoryContext')
vi.mock('@/hooks/useAuth')
vi.mock('@/services/storiesservice/setStoryVisibility')
vi.mock('@/contexts/WhisperDBContext');


describe('SingleStory', () => {
    const mockOnNextStory = vi.fn()
    const mockHandleAddNewStoryClick = vi.fn()
    const mockOnClose = vi.fn()
    const mockHandleDeleteStory = vi.fn()
    const mockSendLikeStory = vi.fn()
    const mockOpenModal = vi.fn()
    const mockCloseModal = vi.fn()

    const defaultStory = {
        id: 1,
        userId: 3,
        media: '31734793545241.image/jpeg',
        type: 'image/jpeg',
        content: 'Test story content',
        liked: false,
        likes: 10,
        views: 5,
        viewed:true,
        date: "2024-12-21T15:05:48.297Z"
    }

    const mockDbRef = {
        current: {
            getAllImages: vi.fn().mockResolvedValue([]),
            getAllVideos: vi.fn().mockResolvedValue([])
        }
    };

    beforeEach(() => {
        vi.useFakeTimers()
        
        // Mock context values
        useModal.mockReturnValue({
            openModal: mockOpenModal,
            closeModal: mockCloseModal
        })

        useWhisperDB.mockReturnValue({ dbRef: mockDbRef });

        useStories.mockReturnValue({
            loading: false,
            error: null,
            currentStory: defaultStory,
            currentUser: { userId: 1 },
            isDeleteing: false,
            handleDeleteStory: mockHandleDeleteStory,
            sendLikeStory: mockSendLikeStory
        })

        useAuth.mockReturnValue({
            user: { id: 1 }
        })

        setStoryPrivacySettings.mockResolvedValue()
    })

    afterEach(() => {
        vi.clearAllMocks()
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    it('renders story content correctly', () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        expect(screen.getByText('Test story content')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument() // Likes count
    })

    it('shows loading state', () => {
        useStories.mockReturnValue({
        ...useStories(),
        loading: true
        })

        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles error state', () => {
        useStories.mockReturnValue({
        ...useStories(),
        error: 'Test error'
        })

        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        expect(screen.getByText('Error: Test error')).toBeInTheDocument()
    })

    it('handles story visibility change', async () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        // Open dropdown menu
        fireEvent.click(screen.getByLabelText('Options'))
        
        // Click visibility option
        fireEvent.click(screen.getByText('Who Can See My Story?'))
        
        // Change visibility
        fireEvent.click(screen.getByLabelText('My Contacts'))

        // Click outside to trigger save
        fireEvent.mouseDown(document.body)
        setTimeout(() => {
            expect(setStoryPrivacySettings).toHaveBeenCalledWith('1', 'Contacts')
        }, [3000])
        
    })

    it('auto-advances to next story after timeout', () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        act(() => {
        vi.advanceTimersByTime(20000)
        })

        expect(mockOnNextStory).toHaveBeenCalled()
    })

    it('pauses and resumes story timer', () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        // Click pause button
        fireEvent.click(screen.getByLabelText('Pause'))

        act(() => {
        vi.advanceTimersByTime(20000)
        })

        // Should not advance while paused
        expect(mockOnNextStory).not.toHaveBeenCalled()

        // Click play button
        fireEvent.click(screen.getByLabelText('Pause'))

        act(() => {
        vi.advanceTimersByTime(20000)
        })

        // Should advance after resuming
        expect(mockOnNextStory).toHaveBeenCalled()
    })

    it('handles story deletion', () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        // Open dropdown menu
        fireEvent.click(screen.getByLabelText('Options'))
        
        // Click delete option
        fireEvent.click(screen.getByText('Delete'))

        expect(mockHandleDeleteStory).toHaveBeenCalled()
    })

    it('handles story like interaction', () => {
        render(
        <SingleStory
            onNextStory={mockOnNextStory}
            handleAddNewStoryClick={mockHandleAddNewStoryClick}
            onClose={mockOnClose}
        />
        )

        fireEvent.click(screen.getByTestId('icon-heart'))
        expect(mockSendLikeStory).toHaveBeenCalled()
    })
})