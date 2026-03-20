import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const auth = useContext(AuthContext);
    
    // If user is not authenticated, redirect to login
    if (!auth.accessToken) {
        return <Navigate to="/auth" replace />;
    }
    
    // If authenticated, render the component
    return children;
}

export default ProtectedRoute;
