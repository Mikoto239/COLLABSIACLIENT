import React, { useState, useEffect } from 'react';
import '../App.css';
import COTLOGO from '../image/sidebar.png';


const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 700) {
        setIsOpen(true); // Keep the sidebar open on larger screens
      } else {
        setIsOpen(false); // Close sidebar on smaller screens
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    <div className='sidebar-container'>


      <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet' />
      <div class={`sidebar ${isOpen ? 'open' : ''}`}>
        <div class="logo-details">
          
          <div class="logo_name">Admin</div>
         
          <i class='bx bx-menu' id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul class="nav-list">
          <li>
            <a href="/admin/dashboard">
              <i class='bx bx-grid-alt'></i>
              <span class="links_name">Dashboard</span>
            </a>
            <span class="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="/admin/memo_manager">
              <i class='bx bx-book' ></i>
              <span class="links_name">Memo Manager</span>
            </a>
            <span class="tooltip">User</span>
          </li>
          <li>
            <a href="/admin/calendar">
              <i class='bx bx-calendar' ></i>
              <span class="links_name">Calendar</span>
            </a>
            <span class="tooltip">Messages</span>
          </li>
          <li>
            <a href="/admin/faculty_manager">
              <i class='bx bx-user' ></i>
              <span class="links_name">Faculty Manager</span>
            </a>
           
          </li>
          <li>
            <a href="/admin/report_list">
              <i class='bx bx-pie-chart-alt-2' ></i>
              <span class="links_name">Report</span>
            </a>
            <span class="tooltip">Analytics</span>
          </li>
          
          <li>
            <a href="/admin/inviteMember">
              <i class='bx bx-send' ></i>
              <span class="links_name">Invite Member</span>
            </a>
        
          </li>
         
        </ul>
      </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
