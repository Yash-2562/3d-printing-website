import { Navigate, useLocation } from 'react-router-dom';
import { authContext } from '../../../context/Auth/Auth';
import { useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ProtectedRoute(props) {
  const { userToken } = useContext(authContext);
  const location = useLocation();

  useEffect(() => {
    if (!userToken) toast.error('Please log in to continue.');
  }, [userToken]);

  if (userToken) {
    return props.children;
  } else {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
}
