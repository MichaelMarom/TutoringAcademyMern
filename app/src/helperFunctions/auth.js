
export const redirect_to_login = (navigate, signOut) => {
    signOut();
    navigate('/login');
    localStorage.removeItem('access_token');
}