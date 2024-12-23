export function parseMentions(message) {
    const mentionRegex = /@\[(.+?)\]\(user:(\d+)\)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(message)) !== null) {
        const [, displayName, userId] = match;

        mentions.push({
            type: 'mention',
            displayName,
            userId: parseInt(userId, 10),
        });
    }

    return mentions;
}