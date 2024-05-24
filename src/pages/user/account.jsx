import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import '../../App.css';

const Userdetails = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    createdAt: '',
    role: '',
    picture: '',
    department:''
  });

  const { name, email, createdAt, role, picture ,department} = profile; // Include 'picture' in the destructuring

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch('https://collabsia.vercel.app/api/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(result => {
        console.log(result); // Log the result to check the structure and data
        setProfile(result.user);
      })
      .catch((error) => {
        console.log(error); // Log any errors for debugging
      });
  }, []);
  return (
    <>
      <HeaderDashboard/>
      <div>
        <h1>User Account Details</h1>
        <div className='profiledetails'>
          <ul>
          <li className='details-list'>
              Picture: <img className='user-picture' src={picture} alt="User" />
            </li>
            <li className='details-list'>Name: {name}</li>
            <li className='details-list'>Email: {email}</li>
            <li className='details-list'>Department: {department}</li>
            <li className='details-list'>Join at: {new Date(createdAt).toLocaleDateString()}</li>
            <li className='details-list'>{role === 1 ? 'Admin' : role === 2 ? 'Secretary' : role === 3 ? 'Instructor' : 'Unregistered user' }</li>
          

          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Userdetails;
