import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteUser = ({ component: Component, ...rest }) => {
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem('token');
  const [role, setRole] = useState(3);

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
        setRole(userRole);
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
        if (!role) {
          // Redirect to login if role is null or empty
          return <Redirect to="/login" />;
        } else if (role === 3) {
          return <Component {...props} />;
        } else if (role === 1) {
          return <Redirect to="/admin/dashboard" />;
        } else if (role === 2) {
          return <Redirect to="/secretary/dashboard" />;
        } else if (role === 0) {
          return <Redirect to="/unregisteruser/dashboard" />;
        }
        return <Redirect to='/login' />;
      }}
    />
  );
};

export default PrivateRouteUser;
