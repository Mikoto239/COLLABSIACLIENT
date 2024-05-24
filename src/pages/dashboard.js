import React, { useState, useEffect } from 'react';
import HeaderDashboard from '../components/headerdashboard';
import Footer from '../components/footer';
import '../App.css';

const Userdashboard = () => {
  const [profile, setProfile] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard'); // Default active menu item

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const { name, email, createdAt, role } = profile; 

  useEffect(() => {
    fetch('/api/getme')
      .then((res) => res.json())
      .then((result) => {
        setProfile(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
    <HeaderDashboard/> 
    <div className="content-header">
  <div>
    <h1>DashBoard</h1>
  </div>
  <div>
    <input
      className="search"
      type="text"
      placeholder="Search"
    />
  </div>
</div>



    <div className="dashboard">
      <div className="sidebar"> 
        <ul>
          <li className={activeMenuItem === 'Dashboard' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Dashboard')} href="#">
              Dashboard
            </a>
          </li>
          <li className={activeMenuItem === 'Memo Manager' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Memo Manager')} href="#">
              Memo Manager
            </a>
          </li>
          <li className={activeMenuItem === 'Calendar' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Calendar')} href="#">
              Calendar
            </a>
          </li>
          <li className={activeMenuItem === 'Faculty Manager' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Faculty Manager')} href="#">
              Faculty Manager
            </a>
          </li>
          <li className={activeMenuItem === 'Report List' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Report List')} href="#">
              Report List
            </a>
          </li>
          <li className={activeMenuItem === 'Invite Members' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Invite Members')} href="#">
              Invite Members
            </a>
          </li>
        </ul>
      </div>
      <div className="content">
        <h1>content</h1>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Userdashboard;
