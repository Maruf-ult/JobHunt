import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { setUser } from '../../Redux/userSlice.jsx';
import { showLoading,hideLoading } from '../../Redux/AlertSlice.jsx';

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const url = import.meta.env.VITE_BACKEND_URL
  const getUser = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${url}/api/get-userid`, { token: localStorage.getItem('token') }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      dispatch(hideLoading());
      // console.log(response.data.success);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
       
      } else {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
      localStorage.clear();
      navigate('/login');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user,getUser]);

  if (localStorage.getItem("token")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
