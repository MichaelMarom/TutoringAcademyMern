import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthorizeRoute = () => {
    // You can customize this component to display an unauthorized message or redirect to a login page
    useEffect(() => {
        console.log('render in unautho')
    }, [])

    const navigate = useNavigate();
    navigate('/login'); // Redirect to a login page if unauthorized
    return null;
}

export default UnAuthorizeRoute
