import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import '../../App.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { Document, Page, pdfjs } from 'react-pdf';
import SidebarSecretary from '../../components/SidebarSecretary';

const SecretaryMemoDetails = () => {
  const [memoDetails, setMemoDetails] = useState(null);
  const history = useHistory();
  const { memoId } = useParams();
  const token = localStorage.getItem('token');
  const [activeMenuItem, setActiveMenuItem] = useState('Memo');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfPages, setPdfPages] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getMeResponse = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const userEmail = getMeResponse.data.user.email;
  
        const response = await axios.get(`https://collabsiaserver.onrender.com/api/memo/created/${memoId}?email=${userEmail}`, {
          responseType: 'blob', // Specify the response type as blob
        });
    
        const pdfUrl = URL.createObjectURL(response.data);
        setPdfUrl(pdfUrl);
        console.log("PDF URL:", pdfUrl);

        const memodetails = await axios.get(`https://collabsiaserver.onrender.com/api/memo/created_details/${memoId}?email=${userEmail}`);
        const details = memodetails.data.memo;
      
        setMemoDetails(details);
      } catch (error) {
        console.error(error);
        history.goBack(); // Redirect or handle error accordingly
      }
    };
  
    fetchData();
  }, [memoId, token, history]);
  


  

  if (!pdfUrl) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <HeaderDashboard />
    
      <div className="dashboard">
        <SidebarSecretary/>
        <div className="content">
        {memoDetails ? ( // Check if memoDetails is not null
          <div className="memo-details-body">
            <Link to="/secretary/memo_manager" className="link-to-memo-manager" >Back</Link>
            <p className="memo-title-sent">Title: {memoDetails.title}</p>
            <p className="memo-timestamp-detau">Sent At: {new Date(memoDetails.createdAt).toLocaleString()}</p>
           

              {pdfUrl ? (
                <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="500px" />
              ) : (
                <p>Loading PDF...</p>
              )}
       

            <div class="memo-recipients-details">
  <h2>Recipients</h2>
  <ul>
    {memoDetails.recipients && memoDetails.recipients.map((recipient, index) => (
      <li key={index} class="recipient">
        <p><strong>Email:</strong> {recipient.useremail}</p>
        <p><strong>Name:</strong> {recipient.username}</p>
        <p><strong>Read:</strong> {recipient.read ? 'Yes' : 'No'}</p>
        <p><strong>Acknowledge:</strong> {recipient.acknowledge ? 'Yes' : 'No'}</p>
      </li>
    ))}
  </ul>
</div>


          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>

      <Footer />
    </>
  );
};

export default SecretaryMemoDetails;
