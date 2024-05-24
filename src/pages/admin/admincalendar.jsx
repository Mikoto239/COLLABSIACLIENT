/*global google*/
import React, { useState, useEffect } from 'react';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import '../../App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {toast} from 'react-toastify';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
const Admincalendar = ({history}) => {
  const [profile, setProfile] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const memoEventsParam = queryParams.get('memoEvents');
  const initialMemoEvents = memoEventsParam ? JSON.parse(decodeURIComponent(memoEventsParam)) : [];
  const [memoEvents, setMemoEvents] = useState(initialMemoEvents);
  const [summary,setSummary] = useState('');
  const [description,setDescription] = useState('');
  const [startDateTime, setstartDateTime] = useState('');
  const [endDateTime,setendDateTime] = useState('');
  const { name, email, createdAt, role } = profile || {};
  const token = localStorage.getItem('token');  
  const [tokenClient, setTokenClient] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thisMonthEvents, setThisMonthEvents] = useState([]);



  


  const handleGoogleSignIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
      console.log( tokenClient.requestAccessToken());
    } else {
      console.error('Token client is not initialized.');
    }
  };
  

  
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

 
  const handleDateClick = async (value) => {
    setSelectedDate(value);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
  
    try {
      const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      const myemail = result.user.email;
  
      const [memoResponse, eventResponse] = await Promise.all([
        axios.post("https://collabsiaserver.onrender.com/api/memo/send-and-recieve", {
          date: formattedDate,
          email: myemail,
        }),
        axios.post("https://collabsiaserver.onrender.com/api/getevent", { useremail: myemail, date: formattedDate }),
      ]);
  
      const memoData = memoResponse.data.memo || [];
      const eventData = eventResponse.data.showmyEvents || [];
  
      if (memoData.length > 0 || eventData.length > 0) {
        const memoEvents = memoData.map((memo) => ({
          title:memo.title,
          memoid: memo._id,
          time: new Date(memo.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          event: memo.senderEmail === myemail ? `Sent Memo: ${memo.title}` : `Received Memo: ${memo.title}`,
          type: memo.senderEmail === myemail ? 'sent' : 'received',
        }));
        
      
        const myEvents = eventData.map((event) => ({
          eventid: event._id,
          title:event.title,
          time: new Date(event.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          startDateTime: new Date(event.startDateTime).toLocaleTimeString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          event:event.title,
          type: 'event',
          description: event.description, 
          endDateTime: new Date(event.endDateTime).toLocaleTimeString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        
    
          const collabEvents = [...memoEvents, ...myEvents];
          setEvents(collabEvents);
      } else {
          console.log('No memos or events found for the selected date:', value);
          setEvents([{ time: 'no data', event: 'No data found for the selected date.' }]);
        
      }
    } catch (error) {
          console.error(error);
          setEvents([{ time: 'no data', event: 'No data found for the selected date.' }]);
        }
  };


  useEffect(() => {
    const fetchEventsForCurrentMonth = async () => {
      try {
        const response = await fetch('https://collabsiaserver.onrender.com/api/getme', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        const myemail = result.user.email;

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const thisMonthEventResponse = await axios.post("https://collabsiaserver.onrender.com/api/Eventonthismonth", { email: myemail });

        const thisMonthEvents = thisMonthEventResponse.data.events.map((event) => ({
          eventid: event._id,
          title: event.title,
          time: new Date(event.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          startDateTime: new Date(event.startDateTime).toLocaleTimeString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          event: event.title,
          type: 'event',
          description: event.description,
          endDateTime: new Date(event.endDateTime).toLocaleTimeString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setThisMonthEvents(thisMonthEvents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEventsForCurrentMonth();
  }, [token]);

  const openModalevent = (eventType) => {
    setSelectedEventType(eventType);
    setIsModalOpen(true);
  };

  const closeModalevent = () => {
    setIsModalOpen(false);
  };




  const openModal = (eventType) => {
    setSelectedEventType(eventType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  
  const handleEventClick = async (event, memoId) => {
     
    if(event.type === 'sent'){
        history.push(`/admin/memo_Icreate/${memoId}`);
      }

    else if(event.type === 'received'){
      const response = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const email = response.data.user.email;
        const read = await axios.post('https://collabsiaserver.onrender.com/api/memo/read', { email, memoId });
        history.push(`/admin/recieve_memo/${memoId}`);
      }
    } else{
      openModal(event);
    }
  };
  

  const handleOutsideClick = (e) => {
    if (isModalOpen && e.target.closest('.modal') === null) {
      closeModal();
    }
  };


  useEffect(() => {
    fetch('https://collabsiaserver.onrender.com/api/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result); 
        setProfile(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  
      document.addEventListener('mousedown', handleOutsideClick);

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
  }, [isModalOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    handleGoogleSignIn();
  };
  
    useEffect(() => {
      const initializeGoogleSignIn = async () => {
        try {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.onload = resolve;
            document.head.appendChild(script);
          });

          google.accounts.id.initialize({
            client_id: '373547344231-ft1oo9dvva0qkbvu4aqhv8f4f82dunbu.apps.googleusercontent.com',
          });

          google.accounts.id.renderButton(
            document.getElementById('createevent'),
            { theme: 'outline', size: 'large', onClick: handleGoogleSignIn }
          );

          setTokenClient(
            google.accounts.oauth2.initTokenClient({
              client_id: '373547344231-ft1oo9dvva0qkbvu4aqhv8f4f82dunbu.apps.googleusercontent.com',
              scope: 'https://www.googleapis.com/auth/calendar',
              callback: handleGoogleSignInCallback,
            })
          );
        } catch (error) {
          console.error('Error loading Google Sign-In API:', error);
        }
      };

      const handleGoogleSignInCallback = async (tokenResponse) => {
        try {
          console.log(startDateTime + "time")
          console.log(tokenResponse)
          if (tokenResponse && tokenResponse.access_token) {
            const event = {
              'summary': summary,
              'description': description,
              'start': { 'dateTime': new Date(startDateTime).toISOString(), 'timeZone': 'Asia/Manila' },
              'end': { 'dateTime': new Date(endDateTime).toISOString(), 'timeZone': 'Asia/Manila' }
            };

            const res = await fetch('https://collabsiaserver.onrender.com/api/getme', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            const result = await res.json();
            const useremail = result.user.email;
        
               axios.post('https://collabsiaserver.onrender.com/api/create_event',{useremail,summary,description,startDateTime,endDateTime}) 
    
           
            const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
              method: "POST",
              headers: {
                'Authorization': 'Bearer ' + tokenResponse.access_token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(event)
            });
          console.log()

            setSummary('');
            setDescription('');
            setstartDateTime('');
            setendDateTime('');
            toast.success("Successfully Create an event to calendar")
      
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Google Calendar API Error:', errorData);
            }
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      
      

      initializeGoogleSignIn();
    }, [summary, description, startDateTime, endDateTime]);

  return (
    <>
    <HeaderDashboard />
    <div className="dashboard">
      <SidebarAdmin />
      <div className="content">
        <div className="calendar-content">
          <div className="calendar-sidebar-calendar">
            <Calendar
              calendarType="gregory"
              nextLabel="Next"
              prevLabel="Prev"
              onClickDay={handleDateClick}
              value={selectedDate}
              tileContent={({ date, view }) =>
                view === 'month' && (
                  <div className="event-indicator">
                    {Array.isArray(memoEvents) &&
                      memoEvents.some(
                        (event) => new Date(event.time).toLocaleDateString() === date.toLocaleDateString()
                      ) && <div className="event-indicator"></div>}
                  </div>
                )
              }
            />
          </div>
          <div className="events-container">
            {selectedDate && (
              <div>
                {events.length > 0 ? (
                  <div>
                    <h2>Events for {selectedDate.toDateString()}:</h2>
                    <ul>
                      {events.map((event, index) => (
                        <li
                          key={index}
                          onClick={() => handleEventClick(event, event.memoid)}
                          className="event-item"
                        >
                          <strong>Date Start:</strong> {event.time} - <strong>Type:</strong> {event.type} - <strong>Title:</strong> {event.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No events for the selected date.</p>
                )}
              </div>
            )}
            {thisMonthEvents.length > 0 ? (
              <div>
                <h2>Events for {new Date().toLocaleString('default', { month: 'long' })}:</h2>
                <ul>
                  {thisMonthEvents.map((event, index) => (
                    <li
                      key={index}
                      onClick={() => openModalevent(event)}
                      className="event-item"
                    >
                      <strong>Start Date:</strong> {event.startDateTime} - <strong>Title:</strong> {event.title} - <strong>End Date:</strong> {event.endDateTime}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No events for the current month.</p>
            )}
          </div>
        </div>
        <div className='createEvent'>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="summary">Summary</label>
            <input type="text" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <label htmlFor="startdatetime">Start Date Time:</label>
            <input type="datetime-local" id="startdatetime" value={startDateTime} onChange={(e) => setstartDateTime(e.target.value)} />
            <label htmlFor="enddatetime">End Date Time:</label>
            <input type="datetime-local" id="enddatetime" value={endDateTime} onChange={(e) => setendDateTime(e.target.value)} />
            <input type="submit" id="createevent" onClick={handleGoogleSignIn} value="Create Event"/>
          </form>
        </div>
      </div>
    </div>
    {isModalOpen && selectedEventType && (
      <div className="modal">
        <h2>Event Details</h2>
        <p>Title:{selectedEventType.event} <br/> Created At: {selectedEventType.time}  <br/> Start At: {selectedEventType.startDateTime} <br/> End At:{selectedEventType.endDateTime} <br/>Description: {selectedEventType.description}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    )}
    <Footer />
  </>
  
  );
};

export default Admincalendar;
