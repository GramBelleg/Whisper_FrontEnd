import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GroupSettings from '@/components/GroupSettings/GroupSettings'

describe('GroupSettings Component', () => {
    const mockHandlePrivacyChange = vi.fn()
    const mockHandlePrivacySubmit = vi.fn()
    const mockHandleLimitSubmit = vi.fn()

    let limit = 500
    const mockHandleLimitChange = vi.fn((event) => {
        if (event.target.value > 0 && event.target.value < 1000) {
            limit = event.target.value
        }
    })

    const setup = (props = {}) => {
        const utils = render(
            <GroupSettings
                privacy='Public'
                limit={limit} // Use the updated limit
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
                handleLimitChange={mockHandleLimitChange}
                handleLimitSubmit={mockHandleLimitSubmit}
                {...props}
            />
        )
        return utils
    }

    afterEach(() => {
        vi.clearAllMocks()
        limit = 500
    })

    it('renders correctly with provided props', () => {
        setup()
        expect(screen.getByText(/Group Settings/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Group Limit/i)).toBeInTheDocument()
        expect(screen.getAllByText(/Save/i)[0]).toBeInTheDocument()
    })

    it('respects min and max values for the group limit input', async () => {
        const { rerender } = setup()
        const limitInput = screen.getByLabelText(/Group Limit/i)

        await userEvent.clear(limitInput)
        await userEvent.type(limitInput, '0')

        rerender(
            <GroupSettings
                privacy='Public'
                limit={limit}
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
                handleLimitChange={mockHandleLimitChange}
                handleLimitSubmit={mockHandleLimitSubmit}
            />
        )

        expect(mockHandleLimitChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: '500' })
            })
        )

        await userEvent.clear(limitInput)
        await userEvent.type(limitInput, '1500')
        fireEvent.blur(limitInput)

        rerender(
            <GroupSettings
                privacy='Public'
                limit={limit}
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
                handleLimitChange={mockHandleLimitChange}
                handleLimitSubmit={mockHandleLimitSubmit}
            />
        )
        expect(mockHandleLimitChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: '150' })
            })
        )
    })

    it('calls handleLimitSubmit when the save button is clicked', async () => {
        setup()
        const saveButton = screen.getByTestId('save-limit')
        await userEvent.click(saveButton)

        expect(mockHandleLimitSubmit).toHaveBeenCalledTimes(1)
    })

    it('interacts with the ChatPrivacy child component', async () => {
        setup()
        const privateRadio = screen.getByLabelText(/Private/i)

        await userEvent.click(privateRadio)
        expect(mockHandlePrivacyChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: 'Private' })
            })
        )

        const savePrivacyButton = screen.getByTestId('save-privacy')
        await userEvent.click(savePrivacyButton)

        expect(mockHandlePrivacySubmit).toHaveBeenCalledTimes(1)
    })

    it('calls handleLimitChange and updates the input value with rerendering', async () => {
        const { rerender } = setup()
        const limitInput = screen.getByTestId('group-limit')

        await userEvent.clear(limitInput)
        await userEvent.type(limitInput, '750')

        rerender(
            <GroupSettings
                privacy='Public'
                limit={limit}
                handlePrivacyChange={mockHandlePrivacyChange}
                handlePrivacySubmit={mockHandlePrivacySubmit}
                handleLimitChange={mockHandleLimitChange}
                handleLimitSubmit={mockHandleLimitSubmit}
            />
        )

        expect(limitInput.value).toBe('750')
        expect(mockHandleLimitChange).toHaveBeenCalledTimes(4)
        expect(mockHandleLimitChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: '750' })
            })
        )
    })
})
