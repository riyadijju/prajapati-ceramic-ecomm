import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicOnlyRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const token = Cookies.get("token");

  return (user || token) ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
