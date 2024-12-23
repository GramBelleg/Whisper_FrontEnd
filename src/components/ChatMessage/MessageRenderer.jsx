import React from 'react';

const MessageRenderer = ({ content }) => {
    const parseMessage = (message) => {
        const mentionRegex = /@\[(.+?)\]\(user:([a-zA-Z0-9_]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(message)) !== null) {
            const [fullMatch, displayName, userId] = match;

            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: message.slice(lastIndex, match.index),
                });
            }

            parts.push({
                type: 'mention',
                displayName,
                userId,
            });

            lastIndex = match.index + fullMatch.length;
        }


        if (lastIndex < message.length) {
            parts.push({
                type: 'text',
                content: message.slice(lastIndex),
            });
        }

        return parts;
    };

    const parsedMessage = parseMessage(content);

    return (
        <>
            {parsedMessage.map((part, index) =>
                part.type === 'mention' ? (
                    <span
                        key={index}
                        style={{
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                        title={`Mention: ${part.displayName}`}
                    >
                        @{part.displayName}
                    </span>
                ) : (
                    part.content
                )
            )}
        </>
    );
};

export default MessageRenderer;