  import React, { useState, useEffect } from 'react';
  import HeaderDashboard from '../../components/headerdashboard';
  import Footer from '../../components/footer';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import SidebarAdmin from '../../components/SidebarAdmin';
  import '../../App.css';

  const Adminfacultymanager = () => {


    const [userprofile, usersetProfile] = useState([]);

    const [activeMenuItem, setActiveMenuItem] = useState('InviteMember'); 
    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [updatedrole, setUpdatedrole] = useState(); // State to store updated department
    const [editedUser, setEditedUser] = useState(null);
    const [isconfirmationopen,setConfirmationopen] = useState(false)
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const token = localStorage.getItem('token');
    const{email, name, role,picture,createdAt,department} = userprofile;
    const [loading, setLoading] = useState(true);


    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (event) => {
      const { value } = event.target;
      setSearchQuery(value);
    };
  
    const filteredUsers = userprofile.filter((user) =>
  user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

    const handleDeleteUser = (email) => {
      // Find the user to delete
      const userToDelete = userprofile.find((user) => user.email === email);
    
      if (userToDelete) {
        setEditedUser(userToDelete);
        setDeleteConfirmationOpen(true);
      } else {
        // Handle the case where the user to delete is not found
        console.error('User to delete not found:', email);
        toast.error('Error deleting user');
      }
    };

    const handleConfirmDelete = () =>{
      handleConfirmDeleteuser();
    }
    const handleConfirmationClosedelete = () => {
      setDeleteConfirmationOpen(false);
    };

    const handleConfirmation = () => {
      setConfirmationopen(true);
    };

    const handleConfirmationClose = () => {
      setConfirmationopen(false);
    };

    const handleConfirmSend = (e) => {
      e.preventDefault(); // Make sure 'e' is the correct event object
      const fakeEvent = e || {}; // Use the passed event or create a fake one
      handleUpdaterole();
      handleConfirmationClose();
    };


    const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem);
    };



    const handleItemClick = (value) => {
      console.log(value);
      
      if (value === 'BSIT') {
        axios.get('/api/getallbsit')
        .then((response)=>{
          usersetProfile(response.data.bsituser);
          setLoading(false);
          toast.success("BSIT MEMBERS"); 
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
      } else if (value === 'BSAT') {
        axios.get('/api/getallbsat')
          .then((response) => {
            usersetProfile(response.data.bsatuser);
            setLoading(false);
            toast.success("BSAT MEMBERS");
          })
          .catch((error) => {
            console.error('Error fetching users:', error);
            setLoading(false); // Set loading to false on error too
            toast.error('Error fetching users');
          });
      } else if (value === 'BSFT') {
        axios.get('/api/getallbsft')
        .then((response)=>{
          usersetProfile(response.data.bsftuser);
          setLoading(false);
          toast.success("BSFT MEMBERS")
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
      }
        else if (value === 'BSET') {
          axios.get('/api/getallbset')
          .then((response)=>{
          usersetProfile(response.data.bsetuser);
          setLoading(false);
          toast.success("BSET MEMBERS")
          })
          .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
      } else if (value === 'ALL') {
        axios.get('/api/getallusers')
        .then((response)=>{
          usersetProfile(response.data.users);
          setLoading(false);
          toast.success("Successfully retrive all users")
        })  .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
      } else if (value === 'ROLE') {
        axios.get('/api/role')
        .then((response)=>{
          usersetProfile(response.data.baseonrole);
          setLoading(false);
          toast.success('Successfuly retrieve!')
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
      }
    };
    


    useEffect(() => {
      axios.get('/api/getallusers', {
          headers: {
              Authorization: `Bearer ${token}`
          },token
          
      })
        .then((response) => {
          usersetProfile(response.data.users); // Assuming response.data.users is an array
          setLoading(false); // Set loading to false once data is fetched
          
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setLoading(false); // Set loading to false on error too
          toast.error('Error fetching users');
        });
    }, []);
    


    const handleConfirmDeleteuser = async (userrole) => {
      try {
        const getMeResponse = await fetch('/api/getme', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (getMeResponse.status === 200 && getMeResponse.ok) {
          const result = await getMeResponse.json();
    
          if (editedUser.email === result.user.email) {
            toast.error('You cannot delete your own account!');
          } else {
            // User is not trying to delete their own account, proceed with deletion
            await axios.post('https://cotmemo.onrender.com/api/deletethisuser', { email: editedUser.email });
    
            usersetProfile((prevProfiles) =>
              prevProfiles.filter((user) => user.email !== editedUser.email)
            );
    
            toast.success('User deleted successfully');
          }
        } else {
          // Handle the case where fetching the user data fails
          console.error('Failed to fetch user data');
          toast.error('Error deleting user: failed to fetch user data');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user: ' + editedUser.email);
      } finally {
        setDeleteConfirmationOpen(false);
      }
    };
    

    const handleUpdaterole = async () => {
      try {
      
    
        await axios.post('/api/updateuserrole', {
          email: editedUser.email,
          role: updatedrole
        });
    
        // Refresh the user profiles after updating the department
        const response = await axios.get('/api/getallusers');
    
        // Find the updated user in the array
        const updatedUser = response.data.users.find(user => user.email === editedUser.email);
    
        // Update the user profiles state
        usersetProfile(response.data.users);
    
        // Map the full department names back to their short forms
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
        toast.success('Role updated successfully. Updated role for ' + updatedRoleName+updatedUser.role);
      } catch (error) {
        console.error('Error updating role:', error);
        toast.error('Error updating role why' + updatedrole);
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
          return '';
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
        
      <SidebarAdmin/>
        <div className="content">
     

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
  <div className='editbuttodelete'>
          <div className="confirmation-modal">
            <div className="modal-content">
              <p>Are you sure you want to update the role of this user?</p>
              <div className="button-container">
                
              <button onClick={handleConfirmSend}>Yes</button>
              <button onClick={handleConfirmationClose}>No</button>
              </div>
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


  export default Adminfacultymanager;
