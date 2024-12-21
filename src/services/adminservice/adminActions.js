import axiosInstance from '../axiosInstance'
export const toggleUserBan = async (userId, isBanning) => {
    try {
        await axiosInstance.put(
            `/api/admin/ban/${isBanning}/user/${userId}`,
            {
                withCredentials: true
            }
        )
        return true
    } catch (error) {
        console.log('Error ', error.message)
        return false
    }
}
export const toggleGroupFilter = async (groupId, isFiltering) => {
    try {
        await axiosInstance.put(
            `/api/admin/filter/${isFiltering}/group/${groupId}`,
            {
                withCredentials: true
            }
        )
        return true
    }
    catch (error) {
        console.log('Error ', error.message)
        return false
    }
}
