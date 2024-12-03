import { whoAmI } from './chatservice/whoAmI'

export const loadAuthData = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    Object.assign(whoAmI, user ? JSON.parse(user) : {})
    return { token, user: user ? JSON.parse(user) : null }
}
