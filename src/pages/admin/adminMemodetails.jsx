import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import '../../App.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
import { Document, Page } from 'react-pdf';

const AdminMemoDetails = () => {
  const [memoDetails, setMemoDetails] = useState(null);
  const history = useHistory();
  const { memoId } = useParams();
  const token = localStorage.getItem('token');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getMeResponse = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const userEmail = getMeResponse.data.user.email;

        // Fetch memo details first
        const memoDetailsResponse = await axios.get(`https://collabsiaserver.onrender.com/api/memo/created_details/${memoId}?email=${userEmail}`);
        const details = memoDetailsResponse.data.memo;
        setMemoDetails(details);

        // Fetch PDF URL
        const pdfResponse = await axios.get(`https://collabsiaserver.onrender.com/api/memo/created/${memoId}?email=${userEmail}`, {
          responseType: 'blob', // Specify the response type as blob
        });

        const pdfBlob = pdfResponse.data;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error("Error fetching memo details:", error);
        history.goBack(); // Redirect or handle error accordingly
      }
    };

    fetchData();
  }, [memoId, token, history]);

  if (!memoDetails) {
    return <p>Loading...</p>;
  }

  const handleBackClick = () => {
    history.push('/admin/memo_manager');
  };

  return (
    <>
      <HeaderDashboard />
      <div className="dashboard">
        <SidebarAdmin />
        <div className="content">
          <div className="memo-details-body">
            <>
              <Link to="/admin/memo_manager" className="link-to-memo-manager" onClick={handleBackClick}>Back</Link>
              <p className="memo-title-sent">Title: {memoDetails.title}</p>
              <p className="memo-timestamp-detau">Sent At: {new Date(memoDetails.createdAt).toLocaleString()}</p>
              <div className="memo-pdf-container">
                {pdfUrl ? (
                  <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="500px" />
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
              <div className="memo-recipients-details">
                <h2>Recipients</h2>
                <ul>
                  {memoDetails.recipients && memoDetails.recipients.map((recipient, index) => (
                    <li key={index} className="recipient">
                      <p><strong>Email:</strong> {recipient.useremail}</p>
                      <p><strong>Name:</strong> {recipient.username}</p>
                      <p><strong>Read:</strong> {recipient.read ? 'Yes' : 'No'}</p>
                      <p><strong>Acknowledge:</strong> {recipient.acknowledge ? 'Yes' : 'No'}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminMemoDetails;
