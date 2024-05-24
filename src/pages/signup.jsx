/*global google*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Signup = ({ history }) => {
  const [captchaisdone, setCaptchaisdone] = useState(false);
  const [captchaToken, setcaptchaToken] = useState(''); // Corrected variable name

  const publickey = "6Ld9COMpAAAAACD6339_VN87SgS5Uv3vkvV0V5sG";
  const [formgoogle, setFormgoogle] = useState({
    email: '',
    name: '',
    picture: '',
  });

  function onchange(token) {
    setCaptchaisdone(true);
    setcaptchaToken(token); // Update the captchaToken state
  }

  const [role, setRole] = useState(0);

  const handleCallbackResponse = async (response) => {
    const userObject = jwtDecode(response.credential);
    const token = response.credential;
    const email = userObject.email;
  
    try {
      if (email) {
        const res = await axios.post('https://collabsiaserver.onrender.com/api/signup', {
          email: email,
          name: userObject.name,
          picture: userObject.picture,
          role: role || 0,
          token
        });
  
     
        if (res.status === 200) {
          const responseData = res.data;
          if (responseData.success) {
            const tokenFromBackend = responseData.token;
            console.log('Signup successful. Token:', tokenFromBackend);
            localStorage.setItem('token', tokenFromBackend);
  
            const { data } = await axios.post('https://collabsiaserver.onrender.com/api/login', {
              email,
              token: token,
            });
  
            if (data.success === true) {
              const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
                headers: {
                  'Authorization': `Bearer ${data.token}`,
                },
              });
  
              if (response.status === 200 && response.ok) {
                toast.success('Successfully Sign-up!');
                history.push('/Unregisteruser/dashboard');
              }
            }
          } else {
            console.error('Signup failed:', responseData.error);
            toast.error(responseData.error);
          }
        }
      }
    } catch (err) {
      console.error('Error in handleCallbackResponse:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        toast.error(err.response?.data?.error + email);
      }
    }
  };
  
  
  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "373547344231-uugg2iqm8p52tmq9iptiscn3905h1dlo.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
  
    const signUpButton = document.getElementById("signUp");
    if (signUpButton) {
      google.accounts.id.renderButton(signUpButton, {
        theme: "outline",
        size: "large",
        text: "Sign Up", // 'Text' should be 'text'
      });
    }
  }, [handleCallbackResponse]);
  
  const handleSignUpClick = () => {
    // Perform sign-up logic here
    if (captchaisdone) {
      console.log('Sign Up button clicked!');
      // Additional logic for sign-up...
    } else {
      console.log('Please complete the reCAPTCHA first.');
      // You can show a message to the user or take other actions.
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="register">
          <h2>Sign Up</h2>
          <ReCAPTCHA sitekey={publickey} className="recaptcha" onChange={onchange} />
          {captchaisdone && (
            <div id="signUp" onClick={handleSignUpClick} style={{ cursor: 'pointer' }}>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
