import { render, screen, fireEvent } from '@testing-library/react'
import GithubButton from '@/components/common/GithubButton'
import useAuth from '@/hooks/useAuth'
import { vi } from 'vitest'

vi.mock('@/hooks/useAuth')

describe('GithubButton Component', () => {
    beforeEach(() => {
        import.meta.env.VITE_APP_GITHUB_CLIENT_ID = 'mock_client_id'
        import.meta.env.VITE_APP_URL = 'http://localhost:5173'
        import.meta.env.VITE_APP_SERVER_URL = 'https://production-url.com'
        process.env.NODE_ENV = 'development'
        useAuth.mockReturnValue({ loading: false })
        delete window.location
        window.location = { href: '' }
    })

    it('renders GitHub button and changes location on click', () => {
        render(<GithubButton />)

        const button = screen.getByText('Sign In With Github')
        fireEvent.click(button)

        const clientId = import.meta.env.VITE_APP_GITHUB_CLIENT_ID
        const homeUrl = import.meta.env.VITE_APP_URL
        const redirectUri = `${homeUrl}/github-callback`
        const expectedUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=user:email`
        expect(window.location.href).toBe(expectedUrl)
    })

    it('disables the button when loading is true', () => {
        useAuth.mockReturnValue({ loading: true })

        render(<GithubButton />)

        const button = screen.getByRole('button', { name: /Sign In With Github/i })
        expect(button).toBeDisabled()
    })

    it('enables the button when loading is false', () => {
        useAuth.mockReturnValue({ loading: false })

        render(<GithubButton />)

        const button = screen.getByRole('button', { name: /Sign In With Github/i })
        expect(button).toBeEnabled()
    })
})
