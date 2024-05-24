import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HeaderDashboard from '../components/headerdashboard';
import Footer from '../components/footer';
import '../App';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;



const UserRecieveMemoDetails = ({ match }) => {
  const [memoDetails, setMemoDetails] = useState(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false); // New state to track acknowledgment
  const history = useHistory();
  const { memoId } = useParams();
  const [acknowledgeStatus, setAcknowledgeStatus] = useState(false);
  const token = localStorage.getItem('token')
  const [activeMenuItem, setActiveMenuItem] = useState('Memo');
  const [pdfUrl, setPdfUrl] = useState('');

  
 


  const handleMenuItemClick = (menuItem) => {
    if (menuItem === 'Dashboard') {
      history.push('/user/dashboard');
    } else if  (menuItem === 'Memo Manager') {
      history.push('/user/memo');
    }
   
   else if  (menuItem === 'Report List') {
      history.push('/user/report_list');
    } else if  (menuItem === 'Calendar') {
      history.push('/user/calendar');
    }
  };


  useEffect(() => {
    const fetchMemoDetails = async () => {
      try {

        const getme = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const myemail = getme.data.user.email;
  
        const response = await axios.get(`https://collabsiaserver.onrender.com/api/memo/details/${memoId}?email=${myemail}`);
        setMemoDetails(response.data.memo);
       
        const res = await axios.get(`https://collabsiaserver.onrender.com/api/memo/pdfdetails/${memoId}?email=${myemail}`, {
          responseType: 'blob', // Specify the response type as blob
        });
    
        const pdfUrl = URL.createObjectURL(res.data);
        setPdfUrl(pdfUrl);
        // Correct acknowledgment request
        const acknowledgmentResponse = await axios.post(
          `https://collabsiaserver.onrender.com/api/Iacknowledge/${memoId}`,
          { email: myemail }
        );
  
        setIsAcknowledged(acknowledgmentResponse.data.acknowledgeStatus);
        setAcknowledgeStatus(acknowledgmentResponse.data.acknowledgeStatus);
      } catch (error) {
        history.goBack();
      }
    };
  
    fetchMemoDetails();
  }, [memoId, token,history]);
  

  const handleAcknowledge = async () => {
    let email;
    let name;
  
    try {
      const response = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200 && response.data) {
        email = response.data.user.email;
        name = response.data.user.name;
        
  
        const acknowledge = await axios.post(`https://collabsiaserver.onrender.com/api/memo/acknowledge/${memoId}`, { email,name});
  
        if (acknowledge.status === 200) {
          setIsAcknowledged(true);
        } else if (acknowledge.status === 404) {
          console.error('Memo not found. Please check the memo ID.');
        } else {
          console.error('Error acknowledging memo:', acknowledge.statusText);
        }
      } else {
        console.error('Error fetching user details:' + email);
      }
    } catch (error) {
      console.error('Error acknowledging memo:', error);
  
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  };
    
  
  
  

if (!memoDetails) {
  return <p>Loading...</p>;
}


  return (
    <>
      <HeaderDashboard />
      <div className="content-header">
        <div>
          <h1>Receive Memo</h1>
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
        <li className={activeMenuItem === 'Dashboard' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Dashboard')} href="Dashboard">
              Dashboard
            </a>
          </li>
          <li className={activeMenuItem === 'Memo Manager' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Memo Manager')} href="memo">
              Memo Manager
            </a>
          </li>
          <li className={activeMenuItem === 'Calendar' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Calendar')} href="#">
              Calendar
            </a>
          </li>
        
          <li className={activeMenuItem === 'Report List' ? 'active' : ''}>
            <a onClick={() => handleMenuItemClick('Report List')} href="report_list">
              Report List
            </a>
          </li>
        </div>

        <div className='content'>
     
          <div className="memo-details-container">
          <Link to={'/user/memo'} className="link-to-send" > Back </Link>
            <h1>Memo Details</h1>
          
            <p className="memo-title-details">Title: {memoDetails.title}</p>
            <p className="memo-sender-details">From: {memoDetails.sender}</p>
            <p className="memo-timestamp-details">Timestamp: {new Date(memoDetails.createdAt).toLocaleString()}</p>
            <p className="memo-content-details">Content: {memoDetails.content}</p>
            <div className="memo-pdf-container">
                {pdfUrl ? (
                  <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="500px" />
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
       

            {isAcknowledged ? (
            <strong>    <p className="acknowledge-info">You have already acknowledged this memo.</p></strong>  
          ) : (
            <>
              <label for='acknowledge'>By clicking this button the Admin notify that you acknowledge this memo</label>
              <button className='acknowledge' onClick={handleAcknowledge}>
                Acknowledge Memo
              </button>
              <p className="acknowledge-info">You haven't acknowledged this memo yet.</p>
            </>
          )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default  UserRecieveMemoDetails;
