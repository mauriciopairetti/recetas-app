// import { useAuth } from '../../context/AuthContext';
import { useAuth } from '../../context/useAuth';


import { Navigate } from 'react-router-dom';

// Componentes para rutas privadas
// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ children, url }) => {
    // const { currentUser } = useAuth();
    const { user } = useAuth();
    // return currentUser ? children : <Navigate to={url} />;
    return user ? children : <Navigate to={url} />;
};