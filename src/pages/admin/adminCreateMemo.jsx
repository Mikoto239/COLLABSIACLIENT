import React, { useState, useEffect, useRef } from 'react';
import HeaderDashboard from '../../components/headerdashboard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../../App.css';
import '../../'
import SidebarAdmin from '../../components/SidebarAdmin';
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense("ORg4AjUWIQA/Gnt2VVhhQ1Fac11JW3xNYVF2R2FJe1RzdF9DZkwgOX1dQ19hSXtTcEVhWndceXFdQmY=");

const AdminCreateMemo = () => {
  // State variables to manage memo data and form input.
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userProfile, usersetProfile] = useState([]);
  const [memoEvents, setMemoEvents] = useState([]);
  const [SenderEmail, SetSenderEmail] = useState('');
  const [file, setFile] = useState('');
  const [storecontent, setStoreContent] = useState();
  let editorObj = useRef(null);
  const onSaveContentRef = useRef('');


  const token = localStorage.getItem('token');


  const { email, name, role, department } = userProfile;



  const handleConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmSend = (e) => {
    e.preventDefault(); // Make sure 'e' is the correct event object
    const fakeEvent = e || {}; // Use the passed event or create a fake one
    handleSubmit(fakeEvent);

    handleConfirmationClose();
  };

  const [activeMenuItem, setActiveMenuItem] = useState('memo_create');
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : userProfile);
  };

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      const isUserSelected = prevSelectedUsers.some((selectedUser) => selectedUser.email === user.email);

      const updatedUsers = isUserSelected
        ? prevSelectedUsers.filter((selectedUser) => selectedUser.email !== user.email)
        : [...prevSelectedUsers, user];

      console.log('Updated Users:', updatedUsers);
      return updatedUsers;
    });


    usersetProfile((prevUsers) => prevUsers.filter((prevUser) => prevUser.email !== email));
  };


  const handleContentChange = async () => {
    if (editorObj.current && editorObj.current.documentEditor) {
      try {
        const documentContent = await editorObj.current.documentEditor.getText();
        // Use getText() instead of getContent()
        console.log('Document Content:', documentContent);
      } catch (error) {
        console.error('Error getting document content:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleConfirmation();

    if (!title) {
      toast.error('Memo is not complete. Please fill in all required fields.');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient.');
      return;
    }

    try {
      const recipientsArray = selectedUsers.map((user) => ({
        useremail: user.email,
        username: user.name,
        read: false,
      }));

      const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const senderName = result.user.name;
        const senderEmail = result.user.email;
        const subject = "New Memo";
        const message = `Hello,

          This is to notify you that a new memo has been created. Please log in to the system http://localhost:3000/ to view the details.
          
          Thank you.`;

        const formData = new FormData();
        console.log(title)
        formData.append('title', title);
        if (file) {
          formData.append('file', file);
        }
        else {
          formData.append('file', new Blob([onSaveContentRef.current], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'memo.docx');
        }
        formData.append('senderEmail', senderEmail);
        formData.append('sender', senderName);
        formData.append('recipients', JSON.stringify(recipientsArray));
        // formData.append('subject', subject);
        // formData.append('message', message);
  
        const { data } = await axios.post('https://collabsiaserver.onrender.com/api/memo/uploads', formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.success) {
          toast.success('Memo Successfully Sent');
          handleConfirmationClose();
          setTitle('');
          setFile('');
          setContent('');
          setSelectedUsers([]);
          // Clear the file input value
          document.getElementById('fileInput').value = '';
        } else {
          toast.error('Failed to send memo. Please try again.');
        }
      } else {
        toast.error('Failed to fetch sender details');
      }
    } catch (error) {
      console.error(error);
      toast.error('Memo not sent. Please try again.');
    }
  };
  const handleItemClick = (value) => {


    if (value === 'BSIT') {
      axios.get('https://collabsiaserver.onrender.com/api/getallbsit')
        .then((response) => {

          const allUsers = response.data.bsituser;


          const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);
          usersetProfile(filteredUsers);

          setLoading(false)

        })
        .catch((error) => {

          toast.error('Error fetching users');
        });
    } else if (value === 'BSAT') {
      axios.get('https://collabsiaserver.onrender.com/api/getallbsat')
        .then((response) => {

          const allUsers = response.data.bsatuser;

          // Filter out the current user
          const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);
          usersetProfile(filteredUsers);

          setLoading(false)

        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false)

        });
    } else if (value === 'BSFT') {
      axios.get('https://collabsiaserver.onrender.com/api/getallbsft')
        .then((response) => {

          const allUsers = response.data.bsftuser;

          // Filter out the current user
          const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);
          usersetProfile(filteredUsers);

          setLoading(false)

        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false)

        });
    }
    else if (value === 'BSET') {
      axios.get('https://collabsiaserver.onrender.com/api/getallbset')
        .then((response) => {
          const allUsers = response.data.bsetuser;

          // Filter out the current user
          const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);
          usersetProfile(filteredUsers);

          setLoading(false)

        })
        .catch((error) => {
          console.error('Error fetching users:', error);

        });
    } else if (value === 'ALL') {
      axios.get('https://collabsiaserver.onrender.com/api/getallusers', {token})
    .then((response) => {
        const allUsers = response.data.users;
    
        // Filter out the current user
        const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);
        usersetProfile(filteredUsers);
    }).catch((error) => {
          console.error('Error fetching users:', error);

        });
    } else if (value === 'ROLE') {
      axios.get('https://collabsiaserver.onrender.com/api/role')
        .then((response) => {
          const allUsers = response.data.baseonrole;

          // Filter out the current user
          const filteredUsers = allUsers.filter(user => user.email !== SenderEmail);

          usersetProfile(filteredUsers);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching users based on role:', error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user details
        const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const senderEmail = result.user.email;

          // Fetch all users
          const usersResponse = await axios.get('https://collabsiaserver.onrender.com/api/getallusers');
          const allUsers = usersResponse.data.users;

          // Filter out the current user from the list
          const filteredUsers = allUsers.filter(user => user.email !== senderEmail);

          SetSenderEmail(senderEmail)
          usersetProfile(filteredUsers);
          setLoading(false);
        } else {
          console.error('Failed to fetch current user details');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData(); // Call the async function

    if (editorObj.current && editorObj.current.documentEditor) {
      editorObj.current.documentEditor.documentChange = handleContentChange;
    }


  }, [token]); // Add token to the dependency array if it's part of the component's state



  return (
    <><div>
    <HeaderDashboard />
 
    <div className="dashboard">
      <SidebarAdmin />  
      <div className="content">
        <div className="Creatememo">
          <Link to={'/admin/memo_manager'} className="link-to-send" id="createMemoback">Back</Link>
          <form className="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="title-memo">
              <input
                type="text"
                value={title}
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Memo title"
                className="form-control"
              />
            </div>
            <div className="fileinput-container">
              <input type="file" id="fileInput" accept="application/pdf/docx" onChange={(e) => setFile(e.target.files[0])} />
              <button type="button" className="memoSend" onClick={handleConfirmation}>
                Send
              </button>
            </div>
            <div className='listoffaculty-create'>
              <div className="dropdown">
                <button type="button" className="dropbtw">Filter</button>
                <div className="dropdown-content-faculty">
                  <div onClick={() => handleItemClick('ALL')}>ALL</div>
                  <div onClick={() => handleItemClick('BSIT')}>BSIT</div>
                  <div onClick={() => handleItemClick('BSAT')}>BSAT</div>
                  <div onClick={() => handleItemClick('BSET')}>BSET</div>
                  <div onClick={() => handleItemClick('BSFT')}>BSFT</div>
                  <div onClick={() => handleItemClick('ROLE')}>ROLE</div>
                </div>
              </div>
              <button type="button" onClick={handleSelectAll} className="selectAllButton">
                {selectAll ? 'Unselect All' : 'Select All'}
              </button>
              {loading ? (
                <p>Loading...</p>
              ) : (
                userProfile
                  .filter(user => user.role !== 0)
                  .map((user, index) => (
                    <div key={index} className="user-details-send">
                      <input
                        type="checkbox"
                        checked={selectedUsers.some((selectedUser) => selectedUser.email === user.email)}
                        onChange={() => handleCheckboxChange(user)}
                      />
                      <div className='details-list'>Name: {user.name}</div>
                      <div className='details-list'>
                        {user.deparment}
                      </div>
                    </div>
                  ))
              )}
              {isConfirmationOpen && (
               <div className="confirmation-modal">
               <div className="modal-content">
                 <p>Are you sure you want to send this memo?</p>
                 <div className="button-container">
                   <button onClick={handleConfirmSend}>Yes</button>
                   <button onClick={handleConfirmationClose}>No</button>
                 </div>
               </div>
             </div>
             
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
    </>
  );
};

export default AdminCreateMemo;
