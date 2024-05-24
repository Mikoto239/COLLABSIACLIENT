import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import axios from 'axios';
import { toast } from 'react-toastify';

const Unregisteruserdashboard = () => {
  const [profile, setProfile] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const { name, email, picture, createdAt, role } = profile || {};
  const token = localStorage.getItem('token');
  const history = useHistory();

  useEffect(() => {
    fetch('https://collabsia.vercel.app/api/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);
  const getRoleText = (role) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Secretary';
      case 3:
        return 'Instructor';
      default:
        return 'Unregistered user';
    }
  };


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!department) {
      toast.error('Please select a department.');
      return;
    }
    try {
      const response = await axios.post('https://collabsia.vercel.app/api/verifycode', {
        code: verificationCode,
        department

      });

      if (response && response.data && response.data.success) {
        const newRole = response.data.code.role;

        await axios.post('https://collabsia.vercel.app/api/deletecode', { code: verificationCode });
        const updateRole = await axios.post('https://collabsia.vercel.app/api/updaterole', {
          email: email,
          role: newRole,
          department: department,
        });

        if (updateRole && updateRole.data && updateRole.data.success) {
          const updatedRole = updateRole.data.user.role;

          setVerificationCode('');
          setMessage('Verification successful.');

          toast.success('Login successfully!');
          switch (updatedRole) {
            case 1:
              history.push('/admin/dashboard');
              break;
            case 2:
              history.push('/secretary/dashboard');
              break;  
            case 3:
              history.push('/user/dashboard');
              break;
            case 0:
            default:
              history.push('/Unregisteruser/dashboard');
              break;
          }
        } else {
          setMessage('Failed to update user role.');
          toast.error('Invalid code');
        }
      } else {
        setMessage('Verification failed. Please try again.');
        toast.error('Invalid code');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setMessage('An error occurred during form submission. Please try again.');
      toast.error('Invalid code');
    }
  };

  return (
    <>
      <HeaderDashboard />
      <div className='dashboard'>
        <div className='wrapper'>
          <h2>Registration</h2>
          <form onSubmit={handleFormSubmit}>
            <div className='input-box'>
              <label htmlFor="user-name">Name: </label>
              <input
                type='text'
                value={name || ''}
                id="user-name"
                readOnly
              />
            </div>

            <div className='input-box'>
              <label htmlFor="user-name">Email: </label>
              <input
                type='text'
                id="user-email"
                value={email || ''}
                readOnly
              />
            </div>
            <div className='input-box'>
              <label htmlFor="user-role">Role:</label>
              <input
                type='text'
                value={getRoleText(role)}
                readOnly
              />
            </div>
            <div className='input-box'>
              <label htmlFor="user-code">Code:</label>
              <input
                type='text'
                placeholder='Verification Code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <div className='input-box'>
              <label htmlFor="user-department">Department:</label>
              <select
  id="user-department"
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
  required
>
  <option value="" disabled selected hidden>Select Department</option>
  <option value="Bachelor of Science and Information Technology">BSIT</option>
  <option value="Bachelor of Science in Food Technology">BSFT</option>
  <option value="Bachelor of Science in Automotive Technology">BSAT</option>
  <option value="Bachelor of Science in Electrical Technology">BSET</option>
</select>

            </div>
            <div className='input-box button'>
              <input type='submit' value='Register Now' />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Unregisteruserdashboard;
