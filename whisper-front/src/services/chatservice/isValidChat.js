import { requiredChatParams } from "./chatParams.js"

export const isValidChat = (chat) => {
    return chat && typeof chat === 'object' && requiredChatParams.every(param => param in chat);
}