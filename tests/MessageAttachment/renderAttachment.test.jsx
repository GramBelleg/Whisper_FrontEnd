import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import MessageAttachmentRenderer from '../../src/components/MessageAttachment/MessageAttachementRenderer'

global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(downloadLink),
        blob: () => Promise.resolve(new Blob())
    })
)

beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'mocked-url')
})

afterAll(() => {
    delete global.URL.createObjectURL
})

describe('MessageAttachmentRenderer', () => {
    vi.mock('@/services/chatservice/media', () => ({
        readMedia: vi.fn(() => Promise.resolve('mocked-presigned-url'))
    }))
    vi.mock('@/hooks/useAuth', () => {
        const mockUseAuth = () => ({
          user: {
            id: '1',
            autoDownloadSize: 12
          }
        });
        return {
          default: mockUseAuth,
          useAuth: mockUseAuth
        }
      })
    vi.mock('./fileServices', () => ({
        downloadAttachment: vi.fn(() =>
            Promise.resolve({
                objectUrl: 'mocked-object-url',
                blob: new Blob()
            })
        )
    }))
    vi.mock('@/contexts/WhisperDBContext', () => ({
        useWhisperDB: vi.fn(() => ({
            dbRef: {
                current: {
                    updateMessage: vi.fn(() => Promise.resolve())
                }
            }
        }))
    }))
    const myVideoMessage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        extension: 'video/mp4',
        attachmentType: '1',
        attachmentName: 'test-video.mp4',
        size: 1
    }
    const myDownloadFileMessage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        extension: 'video/mp4',
        attachmentType: '0',
        attachmentName: 'test-video.mp4',
        size: 1
    }
    const myPhotoMessage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        attachmentName: 'test-photo.mp3',
        extension: 'image/png',
        attachmentType: '1',
        size: 1
    }
    const wrongTypeImage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        attachmentName: 'test-photo.mp3',
        extension: 'wrong/png',
        attachmentType: '1',

        fileType: 1,
        size: 1
    }
    const myAudioMessage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        attachmentName: 'test-audio.mp3',
        extension: 'audio/mp3',
        attachmentType: '2',
        size: 1
    }
    const setAudioDuration = (element, duration) => {
        Object.defineProperty(element, 'duration', {
            writable: true,
            configurable: true,
            value: duration,
            size: 1
        })
    }
    const myBigPhotoMessage = {
        id: '1',
        time: Date.now(),
        objectUrl: null,
        media: 'mock',
        attachmentName: 'test-photo.mp3',
        extension: 'image/png',
        attachmentType: '1',
        size: 10000000000000000
    }
    afterEach(() => {
        vi.clearAllMocks()
    })

    test('renders video attachment correctly', async () => {
        render(<MessageAttachmentRenderer myMessage={myVideoMessage} />)

        await waitFor(() => {
            const videoElement = screen.getByTestId('video-viewer')
            expect(videoElement).toBeInTheDocument()
        })
    })
    test('renders audio attachment correctly', async () => {
        render(<MessageAttachmentRenderer myMessage={myAudioMessage} />)
        await waitFor(() => {
            const audioElement = screen.getByTestId('audio-viewer')
            expect(audioElement).toBeInTheDocument()
        })
        const audioElement = screen.getByTestId('audio-viewer')
        setAudioDuration(audioElement, 120)
        fireEvent(audioElement, new Event('loadedmetadata'))

        await waitFor(() => {
            const durationText = screen.getByText('0:00 / 2:00')
            expect(durationText).toBeInTheDocument()
        })
    })
    test('renders photo attachment correctly', async () => {
        render(<MessageAttachmentRenderer myMessage={myPhotoMessage} />)

        await waitFor(() => {
            const photoElement = screen.getByTestId('image-viewer')
            expect(photoElement).toBeInTheDocument()
        })
    })
    test('renders wrong attachment redirection', async () => {
        render(<MessageAttachmentRenderer myMessage={wrongTypeImage} />)

        await waitFor(() => {
            const photoElement = screen.getByTestId('download-link')
            expect(photoElement).toBeInTheDocument()
            expect(photoElement).toHaveAttribute('download', wrongTypeImage.attachmentName)
        })
    })
    test('renders download attachment correctly', async () => {
        render(<MessageAttachmentRenderer myMessage={myDownloadFileMessage} />)

        await waitFor(() => {
            const downloadElement = screen.getByTestId('download-link')
            expect(downloadElement).toBeInTheDocument()
            expect(downloadElement).toHaveAttribute('download', myDownloadFileMessage.attachmentName)
        })
    })

    test('seek bar functionality', async () => {
        render(<MessageAttachmentRenderer myMessage={myAudioMessage} />)

        await waitFor(() => {
            const audioElement = screen.getByTestId('audio-viewer')
            expect(audioElement).toBeInTheDocument()
        })
        const audioElement = screen.getByTestId('audio-viewer')
        setAudioDuration(audioElement, 120)
        fireEvent(audioElement, new Event('loadedmetadata'))
        const seekBar = screen.getByTestId('seek-bar')
        fireEvent.change(seekBar, { target: { value: '30' } })
        await waitFor(() => {
            const currentTime = parseInt(seekBar.value, 10)
            expect(currentTime).toBe(30)
        })
    })
    test('play and pause audio functionality', async () => {
        const playMock = vi.fn()
        const pauseMock = vi.fn()

        render(<MessageAttachmentRenderer myMessage={myAudioMessage} />)
        const audioElement = await screen.findByTestId('audio-viewer')
        Object.defineProperty(audioElement, 'play', { value: playMock })
        Object.defineProperty(audioElement, 'pause', { value: pauseMock })
        setAudioDuration(audioElement, 120)
        fireEvent(audioElement, new Event('loadedmetadata'))
        const playButton = screen.getByTestId('audio-play-button')
        expect(screen.getByRole('button')).toBeInTheDocument()
        fireEvent.click(playButton)
        expect(playMock).toHaveBeenCalledTimes(1)
        audioElement.currentTime = 1
        fireEvent(audioElement, new Event('timeupdate'))
        fireEvent.click(playButton)
        expect(pauseMock).toHaveBeenCalledTimes(1)
        const seekBar = screen.getByTestId('seek-bar')
        expect(parseInt(seekBar.value, 10)).toBe(1)
    })
    test('audio ending behavior', async () => {
        render(<MessageAttachmentRenderer myMessage={myAudioMessage} />)
        const audioElement = await screen.findByTestId('audio-viewer')
        setAudioDuration(audioElement, 120)
        fireEvent(audioElement, new Event('loadedmetadata'))
        const playButton = screen.getByTestId('audio-play-button')
        fireEvent.click(playButton)
        audioElement.currentTime = 10
        fireEvent(audioElement, new Event('ended'))
        expect(audioElement.currentTime).toBe(0)
        expect(screen.getByText('0:00 / 2:00')).toBeInTheDocument()
    })
    test('renders download button for big photo attachment correctly', async () => {
        render(<MessageAttachmentRenderer myMessage={myBigPhotoMessage} />)

        await waitFor(() => {
            const renderButton = screen.getByTestId('render-button')
            expect(renderButton).toBeInTheDocument()
        })
    })
    test('download button for big photo attachment downloads it', async () => {
        render(<MessageAttachmentRenderer myMessage={myBigPhotoMessage} />)

        await waitFor(() => {
            const renderButton = screen.getByTestId('render-button')
            expect(renderButton).toBeInTheDocument()
            fireEvent.click(renderButton)
        })
        await waitFor(() => {
            const photoElement = screen.getByTestId('image-viewer')
            expect(photoElement).toBeInTheDocument()
        })
    })
})
