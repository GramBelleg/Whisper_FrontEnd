import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationMessage from '@/components/NotificationMessage/NotificationMessage';

describe('NotificationMessage', () => {
    const notificationMock = {
        title: 'Test Notification',
        body: 'This is a test notification body that is intentionally long to test truncation behavior at 100 characters.',
    };

    it('renders the title correctly', () => {
        render(<NotificationMessage notification={notificationMock} type="reply_message" />);
        expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });

    it('renders reply message with truncation for 100 characters', () => {
        render(<NotificationMessage notification={notificationMock} type="reply_message" />);
        expect(
            screen.getByText(
                'Replied to your message: This is a test notification body that is intentionally long to test truncation behavior at 100 chara...'
            )
        ).toBeInTheDocument();
    });

    it('renders mention message with truncation for 100 characters', () => {
        render(<NotificationMessage notification={notificationMock} type="mention_message" />);
        expect(
            screen.getByText(
                'Mentioned you: This is a test notification body that is intentionally long to test truncation behavior at 100 chara...'
            )
        ).toBeInTheDocument();
    });

    it('renders default notification type without additional text and with truncation for 100 characters', () => {
        render(<NotificationMessage notification={notificationMock} type="other_type" />);
        expect(
            screen.getByText(
                'This is a test notification body that is intentionally long to test truncation behavior at 100 chara...'
            )
        ).toBeInTheDocument();
    });

    it('handles short body text without truncation', () => {
        const shortNotificationMock = {
            title: 'Short Notification',
            body: 'Short body',
        };
        render(<NotificationMessage notification={shortNotificationMock} type="reply_message" />);
        expect(screen.getByText('Replied to your message: Short body')).toBeInTheDocument();
    });
});
