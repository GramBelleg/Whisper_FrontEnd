export const loadAuthData = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return { token, user: user ? JSON.parse(user) : null };
  };
  