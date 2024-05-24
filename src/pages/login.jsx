/*global google*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/header';
import Footer from '../components/footer';

const Login = ({ history }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

 

  const handleCallbackResponse = async (response) => {
    try {

      const userObject = jwtDecode(response.credential);
      setFormData(userObject);
      const token = response.credential;

      const { data } = await axios.post('https://collabsiaserver.onrender.com/api/login', {
        email: userObject.email,
        token: token,
      });

      if (data.success === true) {
        const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (response.status === 200 && response.ok) {
          const result = await response.json();
          const role = result.user.role;

          setFormData({});

          if (role === 1 || role =='1') {
            toast.success('Login successfully!');
            history.push('/admin/dashboard');
            
          } else if (role === 2 || role == '2') {
            toast.success('Login successfully!');
            history.push('/secretary/dashboard');
          } else if (role === 3 || role == '3') {
            toast.success('Login successfully!');
            history.push('/user/dashboard');
          } else if (role === 0 ||role == '0') {
            toast.success('Login successfully!');
            history.push('/Unregisteruser/dashboard');
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
        } else {
          toast.error('Login failed. Please check your credentials.');
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'An error occurred.');
    }
  };

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: '373547344231-uugg2iqm8p52tmq9iptiscn3905h1dlo.apps.googleusercontent.com', // Replace with your actual client ID
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById('signin'),
      { theme: 'outline', size: 'large' }
    );

    
    // Uncomment the line below if you want to prompt for Google Sign-In immediately
    // google.accounts.id.prompt();
  }, []);

  return (
    <div>
      <Header />

      <div className="container">
        <div className="register">
          <h2>Login</h2>
          <div id="signin" >Sign In with Google</div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
