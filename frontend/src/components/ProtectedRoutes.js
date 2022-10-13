import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const user = useSelector((state) => state.auth);

  if (!user.token) {
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoutes;
