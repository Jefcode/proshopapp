import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = (props) => {
  const user = useSelector((state) => state.auth);

  if (!user.isAdmin) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};

export default AdminRoutes;
