import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import COTLOGO from '../image/COT.png';
import '../App.css';

const Header = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const token = localStorage.getItem('token');
 
  const history = useHistory();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    createdAt: '',
    role: '',
    picture: '',
    department:'',
  });

  const { name, email, createdAt, role, picture, department } = profile; 

  useEffect(() => {
    const fetchData = async () => {
      if (isNotificationModalOpen) {
        try {
          const res = await fetch('https://collabsiaserver.onrender.com/api/getme', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const result = await res.json();
          const email = result.user.email;
          const name = result.user.name;
          const response = await axios.post('https://collabsiaserver.onrender.com/api/getMynotifications', { email, name });

          const combinedNotifications = [...response.data.ackNotifications, ...response.data.receivedMemos];
          const sortedNotifications = combinedNotifications.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setNotifications(sortedNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchData();
  }, [isNotificationModalOpen, token]);

  const Logout = () => {
    axios.get('https://collabsiaserver.onrender.com/api/logout')
      .then(result => {
        toast.success('Log out Successfully!');
        localStorage.removeItem('token');
        history.push('/login');
      })
      .catch(error => {
        toast.error('An error occurred during logout.');
        console.log(error);
      });
  };

  
  const handleNotificationClick = async (notification) => {
    setIsNotificationModalOpen(false);
    const res = await fetch('https://collabsiaserver.onrender.com/api/getme', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    const result = await res.json();
    const role = result.user.role;
    const email = result.user.email;
    const memoId = notification.memoId;
  
    console.log(notification.memoId);
   console.log(notification.type);
    let destinationPath = '';
    if (notification.type === 'Acknowledge') {

      if (role === 1) {
        destinationPath = `/admin/memo_Icreate/${notification.memoId}`;
      } else if (role === 2) {
        destinationPath = `/secretary/memo_Icreate/${notification.memoId}`;
      }
    } 
    else if (notification.type === 'New Memo') {
      
      if (role === 1) {
        await axios.post('https://collabsiaserver.onrender.com/api/memo/read', { email, memoId });
        destinationPath = `/admin/recieve_memo/${notification.memoId}`;

      } else if (role === 2) {
        await axios.post('https://collabsiaserver.onrender.com/api/memo/read', { email, memoId });
        destinationPath = `/secretary/recieve_memo/${notification.memoId}`;
      } else if (role === 3) {
        await axios.post('https://collabsiaserver.onrender.com/api/memo/read', { email, memoId });
        destinationPath = `/user/memo/${notification.memoId}`;
      }
    }
  
    
    if (destinationPath) {
      history.push(destinationPath);
    }
  };
  
  useEffect(() => {
    fetch('https://collabsiaserver.onrender.com/api/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(result => {
        console.log(result); 
        setProfile(result.user);
      })
      .catch((error) => {
        console.log(error); 
      });
  }, []);

  const handleAccountButtonClick = () => {
    setIsUserDetailsModalOpen(!isUserDetailsModalOpen);
    // Close the notification modal when opening the account modal
    setIsNotificationModalOpen(false);
  };

  const handleNotificationButtonClick = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
    // Close the account modal when opening the notification modal
    setIsUserDetailsModalOpen(false);
  };

  const handleCloseUserDetailsModal = () => {
    setIsUserDetailsModalOpen(false);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  return (
    <div>
      <div className='head'>
      <div className='header-content'>
        <img src={COTLOGO} alt="COT-LOGO" className='logo' />
         <div className='title'>
          <h5>BUKIDNON STATE UNIVERSITY</h5>
          <h4>COLLEGE OF TECHNOLOGIES</h4>
        </div>  
        <ul className='nav-item-headerdashboard'>
          <div className='account-container'>
            <button
              type="button"
              className='account-button'
              onClick={handleAccountButtonClick}
            >
              Account
            </button>

            {isUserDetailsModalOpen && (
              <div className="modal">
                <center> <h2>User Details</h2></center>
                <div className='profiledetailsheader'>
                  <ul>
                    <p className='details-picture'>
                      <img className='user-picture' src={picture} alt="User"  style={{ display: 'block', margin: 'auto' }}/>
                    </p>
                    <p className='details-lists'>Name: {name}</p>
                    <p className='details-list'>Email: {email}</p>
                    <p className='details-list'>Department: {department}</p>
                    <p className='details-list'>Join at: {new Date(createdAt).toLocaleDateString()}</p>
                    <p className='details-list'>Role : {role === 1 ? 'Admin' : role === 2 ? 'Secretary' : role === 3 ? 'Instructor' : 'Unregistered user' }</p>
                  </ul>
                </div>
                <button onClick={handleCloseUserDetailsModal}>Close</button>
              </div>
            )}
          </div>

          <div className="notification-container">
            <button
              type="button"
              className="notification-button"
              onClick={handleNotificationButtonClick}
            >
              Notification
            </button>
            {isNotificationModalOpen && (
              <div className="modal">
                <h2>Notifications</h2>
                <div className="notifications-scroll-container">
                {notifications.map(notification => (
  <p
    key={notification._id}
    onClick={() => handleNotificationClick(notification)}
    className="clickable-notification"
  >
    From: {notification.senderName} <strong>{notification.type}</strong> the memo
  </p>
))}

                </div>
                <button onClick={handleCloseNotificationModal}>Close</button>
              </div>
            )}
          </div>
          <button className='button-logout' type="submit" to='/login' onClick={Logout}>
            Log out
          </button>
        </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
