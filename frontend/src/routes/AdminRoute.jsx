import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
