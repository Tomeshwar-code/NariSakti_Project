import { Navigate } from 'react-router-dom';

function SellerRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'seller') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default SellerRoute;
