import axiosInstance from '../axiosInstance'
export const setSelfDestructionTimer = async (chatId, duration) => {
    try {
        const response = await axiosInstance.put(`/api/chats/${chatId}/selfDestruct`,{
            duration: duration ? parseInt(duration) : null
        })
        return response.status == 200
    } catch (error) {
        console.error('Error searching chat:', error)
    }
    return false
}
