import axios from "axios";


export const getMessageInfo = async (messsageId, userId) => {

    if (messsageId) {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/${messsageId}/getMessageStatus`, {
                withCredentials: true,
            });

            //const data = response.data;
            console.log(response.data)
            const data = {
                deliveredUsers: [
                    {
                        delivered: "2024-12-01T21:26:26.852Z",
                        user: {
                            id: 2,
                        }
                    }
                ]
            }
            let deliveredTime = null;
            let readTime = null;
            let delivered = false;
            if (data && data.deliveredUsers) {
                const filtered = data.deliveredUsers.filter((singleUser) => singleUser.user.id === userId);
                delivered = filtered.length > 0;
            }
            let read = false;
            if (data && data.readUsers) {
                const filtered = data.readUsers.filter((singleUser) => singleUser.user.id === userId)
                read = filtered.length > 0;
            }
            
            if (delivered) {
                deliveredTime = data.deliveredUsers[0].delivered;
            }

            if (read) {
                readTime = data.readUsers[0].read;
            }
            console.log(deliveredTime, " ", readTime);
            return { deliveredTime, readTime };
        } catch (error) {
            console.log(error);
        }
    } else {
        throw new Error('Message ID is required');
    }
}