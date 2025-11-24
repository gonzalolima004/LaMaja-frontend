import { Navigate, Outlet } from 'react-router-dom';

const VerificadorToken: React.FC = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default VerificadorToken;