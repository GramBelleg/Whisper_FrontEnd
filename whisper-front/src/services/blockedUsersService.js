import axiosInstance from './axiosInstance'

export const blockedUsersAPI = {
    index: '/api/user/blocked',
    update: '/api/user/block'
}

export const fetchBlockedUsers = async () => {
    return await axiosInstance.get(blockedUsersAPI.index, {
        withCredentials: true
    })
}

export const setBlockedStateForUser = async (userId, blockState) => {
    return await axiosInstance
        .put(
            blockedUsersAPI.update,
            {
                users: [userId],
                blocked: blockState
            },
            {
                withCredentials: true
            }
        );
}
