import React from 'react';
import COTLOGO from '../image/COT.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='head'>
      <div className='header-content'>
        <img src={COTLOGO} alt="COT-LOGO" className='logo' />
        <div className='title'>
          <h5>BUKIDNON STATE UNIVERSITY</h5>
          <h4>COLLEGE OF TECHNOLOGIES</h4>
        </div>
      </div>
      <div className='header-button'>
        <Link className="nav-link-login" to='/login'>
          Login
        </Link>
        <Link className="nav-link-signup" to='/signup'>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default Header;
