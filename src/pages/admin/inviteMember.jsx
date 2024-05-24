import React, { useState, useEffect } from 'react';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import SidebarAdmin from '../../components/SidebarAdmin';
import '../../App.css';

const InviteMember = () => {
  const [profile, setProfile] = useState({ email: '' });
  const [activeMenuItem, setActiveMenuItem] = useState('InviteMember');
  const [recipient, setRecipient] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [role, setRole] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmSend = (e) => {
    e.preventDefault();
    handleFormSubmit(e);
    handleConfirmationClose();
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const { email } = profile;
  const token = localStorage.getItem('token');

  const generateCode = () => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset.charAt(randomIndex);
    }

    return code;
  };

  useEffect(() => {
    fetch('https://collabsiaserver.onrender.com/api/details', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => setProfile(result.user))
      .catch((error) => console.log(error));
  }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    handleConfirmation();
    const code = generateCode();

    try {
      await axios.post('https://collabsiaserver.onrender.com/api/invite', {
        sender: email,
        recipient: recipient,
        subject: "Invitation From COT Department",
        message: `Hello, I am the admin of this system. Please go to this site: http://localhost:3000/ and use this code ${code}. Do not share this code with others.`,
        code: code,
        role: role
      });

      setRecipient('');
      setRole('');
      setGeneratedCode('');

      toast.success('Successfully sent');
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <>
      <HeaderDashboard />
      <div className="dashboard">
        <div>
          <h1>Invite Members</h1>
        </div>
      </div>
      <div className="dashboard">
        <SidebarAdmin />
        <div className="content">
          <div className='send-invitation'>
          <form onSubmit={handleFormSubmit}>
  <div className="gmailrecipient">
    <label htmlFor="recipient">Send to:</label>
    <input
      type="text"
      onChange={(e) => setRecipient(e.target.value)}
      name="recipient"
      placeholder="Send to"
  
      value={recipient}
    />
  </div>
  <div className="roleselect">
    <label htmlFor="role">Select Role:</label>
    <select
      onChange={(e) => setRole(e.target.value)}
      value={role}
      name="role"
      id="role"
    >
      <option value="" disabled selected hidden>Select Role</option>
      <option value="1">Admin</option>
      <option value="2">Secretary</option>
      <option value="3">User</option>
    </select>
    <button type="button" className="send-invite-button" onClick={handleConfirmation}>Send</button>
  </div>
</form>


            {isConfirmationOpen && (
              <div className="confirmation-modal">
                <div className="modal-content">
                  <p>Are you sure you want to invite this user?</p>
                  <div className="button-container">
                  <button onClick={handleConfirmSend}>Yes</button>
                  <button onClick={handleConfirmationClose}>No</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InviteMember;
