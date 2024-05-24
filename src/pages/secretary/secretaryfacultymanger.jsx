import React, { useState, useEffect } from 'react';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import SidebarSecretary from '../../components/SidebarSecretary';
import '../../App.css';

const Secretaryfacultymanager = () => {
  const [userprofile, usersetProfile] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState('InviteMember'); 
  const [editMode, setEditMode] = useState(false);
  const [updatedrole, setUpdatedrole] = useState();
  const [editedUser, setEditedUser] = useState(null);
  const [isconfirmationopen, setConfirmationopen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  const filteredUsers = userprofile.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = (userrole) => {
    handleConfirmDeleteuser(userrole);
    handleConfirmationClose();
  };

  const handleConfirmationClosedelete = () => {
    setDeleteConfirmationOpen(false);
  };
  const handleConfirmation = () => {
    // Open the confirmation modal
    setConfirmationopen(true);
  };

  const handleConfirmSend = (userrole) => {
    // Close the confirmation modal
    setConfirmationopen(false);
    // Handle the update action here
    handleUpdaterole(userrole);
  };

  const handleConfirmationClose = () => {
    // Close the confirmation modal
    setConfirmationopen(false);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const token = localStorage.getItem('token');

  const handleItemClick = (value) => {
    setLoading(true);
    let url = '';
    switch (value) {
      case 'BSIT':
        url = 'https://collabsiaserver.onrender.com/api/getallbsit';
        break;
      case 'BSAT':
        url = 'https://collabsiaserver.onrender.com/api/getallbsat';
        break;
      case 'BSFT':
        url = 'https://collabsiaserver.onrender.com/api/getallbsft';
        break;
      case 'BSET':
        url = 'https://collabsiaserver.onrender.com/api/getallbset';
        break;
      case 'ALL':
        url = 'https://collabsiaserver.onrender.com/api/getallusers';
        break;
      case 'ROLE':
        url = 'https://collabsiaserver.onrender.com/api/role';
        break;
      default:
        break;
    }

    if (url) {
      axios.get(url)
        .then((response) => {
          usersetProfile(response.data.users || response.data.bsituser || response.data.bsatuser || response.data.bsftuser || response.data.bsetuser || response.data.baseonrole);
          setLoading(false);
          toast.success(`${value} MEMBERS`);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false);
          toast.error('Error fetching users');
        });
    }
  };

  useEffect(() => {
    axios.get('https://collabsiaserver.onrender.com/api/getallusers')
      .then((response) => {
        usersetProfile(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
        toast.error('Error fetching users');
      });
  }, []);

  const handleConfirmDeleteuser = async (userrole) => {
    try {
      const getMeResponse = await fetch('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (getMeResponse.status === 200 && getMeResponse.ok) {
        const result = await getMeResponse.json();
        const editorrole = result.user.role;

        if (editorrole === 2 && userrole === 1) {
          toast.error('You cannot delete this user!');
        } else if (editedUser.email === result.user.email) {
          toast.error('You cannot delete your own account!');
        } else {
          await axios.post('https://collabsiaserver.onrender.com/api/deletethisuser', { email: editedUser.email });

          usersetProfile((prevProfiles) =>
            prevProfiles.filter((user) => user.email !== editedUser.email)
          );

          toast.success('User deleted successfully');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user' + editedUser.email);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleUpdaterole = async (userrole) => {
    try {
      const getMeResponse = await fetch('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (getMeResponse.status === 200 && getMeResponse.ok) {
        const result = await getMeResponse.json();
        const editorrole = result.user.role;

        if (editorrole === 2 ||  userrole === 1) {
          toast.error('You cannot edit this user role!');
        } else {
          const updateRoleResponse = await axios.post('https://collabsiaserver.onrender.com/api/updateuserrole', {
            email: editedUser.email,
            role: updatedrole
          });

          if (updateRoleResponse.status === 200 && updateRoleResponse.data.success) {
            const getUsersResponse = await axios.get('https://collabsiaserver.onrender.com/api/getallusers');
            const updatedUser = getUsersResponse.data.users.find(user => user.email === editedUser.email);

            usersetProfile(getUsersResponse.data.users);

            let updatedRoleName;
            if (updatedUser.role === 1) {
              updatedRoleName = 'Admin';
            } else if (updatedUser.role === 2) {
              updatedRoleName = 'Secretary';
            } else if (updatedUser.role === 3) {
              updatedRoleName = 'User';
            }

            setEditMode(false);
            setUpdatedrole(updatedRoleName);
            toast.success('Role updated successfully. Updated role for ' + editorrole);
          } else {
            console.error('Role update failed:', updateRoleResponse.data.message);
            toast.error('Role update failed');
          }
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error updating role why');
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Secretary';
      case 3:
        return 'User';
      default:
        return 'Unregistered User';
    }
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setEditedUser(user);
    setUpdatedrole(user.role);
  };

  return (
    <>
    <HeaderDashboard />
    <div className="content-header">
      <div>
        <h1>Faculty Manager</h1>
      </div>
      <div>
      <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
            className="search"
          />
        </div>
      </div>  
    
    <div className="dashboard">
      
    <SidebarSecretary/>
      <div className="content">
          <h1>List of Members</h1>

          <div className='faculty-content'>
          <div class="dropdownfaculty">
      
            <button class="dropbtnfacultymanager">Filter</button>
          
            <div class="dropdown-content">
              <div onClick={() => handleItemClick('ALL')}>ALL</div>
              <div onClick={() => handleItemClick('BSIT')}>BSIT</div>
              <div onClick={() => handleItemClick('BSAT')}>BSAT</div>
              <div onClick={() => handleItemClick('BSET')}>BSET</div>
              <div onClick={() => handleItemClick('BSFT')}>BSFT</div>
              <div onClick={() => handleItemClick('ROLE')}>ROLE</div>
            </div>
          </div>
      
          <div className='list-user'>
                  
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredUsers.map((user, index) => (
              <div className= "User-content" key={index}>
              <br></br>
                <ul>
                
                <div className='User-constent'>
                <li className='details-lists'> <img className='user-picture' src={user.picture} alt="User" />
            </li>
                  <li className='details-lists'>Name: {user.name}</li>
                  <li className='details-lists'>Email: {user.email}</li>
                  <li className='details-lists'>Role: {user.role === 1 ? 'Admin' : user.role === 2 ? 'Secretary' : user.role === 3 ? 'Instructor' : 'Unregistered user'}</li>
                  <li className='details-lists'>
      

                  <li className='details-list-update'>
                    {editMode && editedUser && user.email === editedUser.email ? (
                      <>
                        
            <div className="dropdownfacultymana">
             Role:
              <button className="dropbtnfaculty">{getRoleName(updatedrole)}</button>
             
              <div className="dropdown-content">
                <div onClick={() => setUpdatedrole(1)}>Admin</div>
                <div onClick={() => setUpdatedrole(2)}>Secretary</div>
                <div onClick={() => setUpdatedrole(3)}>User</div>
                <div onClick={() => setUpdatedrole(0)}>UnregisterUser</div>
              </div>
              
            </div>
            <button className='editbutton'type="button" onClick={handleConfirmation}>Update</button>
            <button className='editbutton'type="button"onClick={() =>  handleDeleteUser(user.email)}>Delete</button>
      
      
          </>
        ) : (
          <button className='editbutton' type="button" onClick={() => handleEditUser(user)}>Edit Role</button>
        )}
                  </li>


                  </li>
                  </div>
                </ul>

              </div>
            ))
          )}
            {isconfirmationopen && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>Are you sure you want to update the role of this user?</p>
            <div className="button-container">
            <button onClick={handleConfirmSend}>Yes</button>
            <button onClick={handleConfirmationClose}>No</button>
            </div>
          </div>
        </div>
      )}

      
{isDeleteConfirmationOpen && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this user?</p>
            <div className="button-container">
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleConfirmationClosedelete}>No</button>
            </div>
          </div>
        </div>
      )}                                                                  
        </div>
        
        </div>
      </div>
      </div>
      
      <Footer />
    </>
  
  );
};

export default Secretaryfacultymanager;
