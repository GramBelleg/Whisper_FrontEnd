import apiUrl from "@/config"
import axios from "axios"


export const addNewContact = async (userName) => {
    try {
        console.log(userName)
        const token = localStorage.getItem('token')
        await axios.post(`${apiUrl}/api/user/contact`,
            {
                userName:userName
            }, {
                headers: {
                Authorization: `Bearer ${token}`  
            },
            withCredentials: true
        })
        
    } catch (error) {
        console.log(error)
    }
}