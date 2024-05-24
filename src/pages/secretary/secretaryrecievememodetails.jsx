import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import '../../App';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarSecretary from '../../components/SidebarSecretary';
import SidebarAdmin from '../../components/SidebarAdmin';

const SecretaryRecieveMemoDetails = ({ match }) => {
  const [memoDetails, setMemoDetails] = useState(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const history = useHistory();
  const { memoId } = useParams();
  const [acknowledgeStatus, setAcknowledgeStatus] = useState(false);
  const token = localStorage.getItem('token')
  const [activeMenuItem, setActiveMenuItem] = useState('Memo');
  const [pdfUrl, setPdfUrl] = useState('');

  
 

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
  
    }
  };
    
  
  
  

if (!memoDetails) {
  return <p>Loading...</p>;
}


  return (
    <>
    <HeaderDashboard />
   

    <div className="dashboard">
   <SidebarAdmin/>

      <div className='content'>
   
        <div className="memo-details-body">
        <Link to={'/secretary/memo_manager'} className="link-to-send" > Back </Link>

        
          <p className="memo-title-sent">Title: {memoDetails.title}</p>
          <p className="memo-sender-details">From: {memoDetails.sender}</p>
          <p className="memo-timestamp-details">Received At: {new Date(memoDetails.createdAt).toLocaleString()}</p>
           
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
       <div class="acknowledge-container">
<label for="acknowledge" class="acknowledge-label">
  By clicking this button the Admin notify that you acknowledge this memo
</label>
<button class="acknowledge-button" id="acknowledge" onclick="handleAcknowledge()">
  Acknowledge Memo
</button>
</div>
          </>
        )}
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
};

export default  SecretaryRecieveMemoDetails;
