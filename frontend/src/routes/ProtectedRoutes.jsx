import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  try {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoutes;
