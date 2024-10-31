export const checkDisplayTime = (lastMessageTime) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    const lastMessageDate = new Date(lastMessageTime);
    const timeDiffInDays = Math.floor((today - lastMessageDate) / 86400000);

    if (timeDiffInDays === 0) {
        const hours = String(lastMessageDate.getHours()).padStart(2, '0'); // Two-digit hours
        const minutes = String(lastMessageDate.getMinutes()).padStart(2, '0'); // Two-digit minutes
        return `${hours}:${minutes}`;
    } else if (timeDiffInDays === 1) {
        return 'Yesterday';
    } else {
        const day = String(lastMessageDate.getDate()).padStart(2, '0');
        const month = String(lastMessageDate.getMonth() + 1).padStart(2, '0');
        const year = lastMessageDate.getFullYear();
        return `${day}:${month}:${year}`;
    }
};
