import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteUnregistedr = ({ component: Component, ...rest }) => {
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem('token');
  const myrole = localStorage.getItem('role');
  const [role, setRole] = useState(0); // Changed variable name from role to setRole

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userRole = response.data.user.role;
        setUserRole(userRole);
        setRole(userRole); // Set the role state
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, e.g., show an error message to the user
      }
    };
    fetchData();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (role == '0' || role === 0 ) { // Check if role is '0' instead of role itself
          return <Component {...props} />;
        } else if (  role == '1' || role === 1 ) {
          return <Redirect to="/admin/dashboard" />;
        } else if ( role == '3' || role === 3 ) {
          return <Redirect to="/user/dashboard" />;
        } else if (role == '2' || role === 2 ) {
          return <Redirect to="/secretary/dashboard" />;
        } 
        // else {
        //   return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        // }
        return <Redirect to='/login' />;
      }}
    />
  );
};

export default PrivateRouteUnregistedr;
