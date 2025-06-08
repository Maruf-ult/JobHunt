
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoute(props) {
  if(localStorage.getItem("token")){
      return  <Navigate to="/home"/>;
  } else {
       return props.children;
  }
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PublicRoute;
