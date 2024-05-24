import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteSecretary = ({ component: Component, ...rest }) => {
  const [userRole, setUserRole] = useState(null);
  const token = localStorage.getItem('token');
  const myrole = localStorage.getItem('role');
  const [role, setRole] = useState(2);

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
        setRole(userRole); // Update the role state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
       if ( role == '2' || role === 2) {
       
          return <Component {...props} />;
        }
        else if (role == '1' || role === 1) { // Check if role is set before comparing its value
          return <Redirect to="/admin/dashboard" />;
        }  else if (role == '3' || role === 3 ) {
          return <Redirect to="/user/dashboard" />;
        } else if ( role == '0' || role === 0 ) {
          return <Redirect to="/unregisteruser/dashboard" />;
        } 
        // else {
        //   return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        // }
        return <Redirect to='/login' />;
      }}
    />
  );
};

export default PrivateRouteSecretary;
