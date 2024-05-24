import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import HeaderDashboard from '../components/HeaderDashboard';
import Footer from '../components/Footer';
import SidebarUser from '../../components/SidebarUser';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const UserRecieveMemoDetails = () => {
  const [memoDetails, setMemoDetails] = useState(null);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const history = useHistory();
  const { memoId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMemoDetails = async () => {
      try {
        const getMeResponse = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myEmail = getMeResponse.data.user.email;

        const memoResponse = await axios.get(`https://collabsiaserver.onrender.com/api/memo/details/${memoId}?email=${myEmail}`);
        setMemoDetails(memoResponse.data.memo);

        const pdfResponse = await axios.get(`https://collabsiaserver.onrender.com/api/memo/pdfdetails/${memoId}?email=${myEmail}`, {
          responseType: 'blob',
        });

        const pdfUrl = URL.createObjectURL(pdfResponse.data);
        setPdfUrl(pdfUrl);

        const acknowledgmentResponse = await axios.post(`https://collabsiaserver.onrender.com/api/Iacknowledge/${memoId}`, { email: myEmail });
        setIsAcknowledged(acknowledgmentResponse.data.acknowledgeStatus);
      } catch (error) {
        console.error('Error fetching memo details:', error);
        history.goBack();
      }
    };

    fetchMemoDetails();
  }, [memoId, token, history]);

  const handleAcknowledge = async () => {
    try {
      const response = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        const email = response.data.user.email;
        const name = response.data.user.name;

        const acknowledgeResponse = await axios.post(`https://collabsiaserver.onrender.com/api/memo/acknowledge/${memoId}`, { email, name });

        if (acknowledgeResponse.status === 200) {
          setIsAcknowledged(true);
        } else {
          console.error('Error acknowledging memo:', acknowledgeResponse.statusText);
        }
      } else {
        console.error('Error fetching user details');
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
        <SidebarUser />
        <div className="content">
          <div className="memo-details-container">
            <Link to="/user/memo" className="link-to-send">Back</Link>
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
              <strong><p className="acknowledge-info">You have already acknowledged this memo.</p></strong>
            ) : (
              <>
                <label htmlFor="acknowledge">By clicking this button the Admin will be notified that you acknowledge this memo</label>
                <button className="acknowledge" onClick={handleAcknowledge}>
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

export default UserRecieveMemoDetails;
              
