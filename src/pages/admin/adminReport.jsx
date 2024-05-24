import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import HeaderDashboard from '../../components/headerdashboard';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
import '../../App.css';

const AdminReport = () => {
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const startYear = 2000;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  const token = localStorage.getItem('token');

  const handleMonthChange = (event) => {
    const selectedMonthValue = event.target.value;
    setSelectedMonth(selectedMonthValue);
    handleDate(selectedMonthValue, selectedYear);
  };
  
  const handleYearChange = (event) => {
    const selectedYearValue = event.target.value;
    setSelectedYear(selectedYearValue);
    handleDate(selectedMonth, selectedYearValue);
  };

  const handleDate = async (month, year) => {
    try {
      const getme = await axios.get('https://collabsiaserver.onrender.com/api/getme', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const email = getme.data.user.email;

      const Allreport = await axios.post('https://collabsiaserver.onrender.com/api/allreport', {
        email,
        month,
        year,
      });

      if (Allreport.data === false) {
        setMonthlyData([]);
        return;
      }

      const ReceiveMemoReport = Allreport.data.receivememo || [];
      const SendMemoReport = Allreport.data.sentmemo || [];

      setMonthlyData(generateMonthlyData(ReceiveMemoReport, SendMemoReport));
    } catch (error) {
      console.log(error);
    }
  };

  const generateMonthlyData = (receiveMemos, sendMemos) => {
    const daysInMonth = 31;
    const monthlyData = [];
  
    for (let day = 1; day <= daysInMonth; day++) {
      const sentOnDay = sendMemos.filter(memo => getDayFromDate(memo.createdAt) === day);
      const receivedOnDay = receiveMemos.filter(memo => getDayFromDate(memo.createdAt) === day);
  
      monthlyData.push({
        name: `Day ${day}`,
        Sent: sentOnDay.length,
        Received: receivedOnDay.length,
        sentMemos: sentOnDay, 
        receivedMemos: receivedOnDay, 
      });
    }
  
    return monthlyData;
  };

  const getDayFromDate = (date) => new Date(date).getDate();

  useEffect(() => {
    handleDate(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <HeaderDashboard />
      <div className="content-header">
        <h1>Report</h1>
      </div>
      <div className="dashboard">
        <SidebarAdmin />
        <div className="content">
          <div className="report-list">
          
                <label htmlFor="monthSelect">Select Month: </label>
                <select id="monthSelect" onChange={handleMonthChange} value={selectedMonth}>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                
               <div className="filter-item">
                <label htmlFor="yearSelect">Select Year: </label>
                <select id="yearSelect" onChange={handleYearChange} value={selectedYear}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
            <div className="graph-report-list">
              
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                width={100}
                height={250}
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{ background: 'white' }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => Math.round(tick)} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sent" stroke="red" />
                <Line type="monotone" dataKey="Received" stroke="blue" />
              </LineChart>
              </ResponsiveContainer>
            </div>
            

            <div className="report-list-memo-details">
              <h3>DETAILS</h3>
              <div className="memo-details-on-that-day">
                {monthlyData.map((dayData, index) => (
                  (dayData.Sent > 0 || dayData.Received > 0) && (
                    <div key={index}>
                      <h3>{dayData.name}:</h3>
                      <ul>
                        {dayData.sentMemos.length > 0 && (
                          <>
                            <h3>Sent Memo</h3>
                            {dayData.sentMemos.map((sentMemo, sentIndex) => (
                              <li key={`sent-${sentIndex}`}>
                                <b>Title:</b> {sentMemo.title}
                                {' '}
                                <Link to={`/admin/sent_report/${sentMemo._id}`} className="view-details">View Details</Link>
                              </li>
                            ))}
                          </>
                        )}
                        {dayData.receivedMemos.length > 0 && (
                          <>
                            <h3 className='receive-title'>Received Memo</h3>
                            {dayData.receivedMemos.map((receivedMemo, receivedIndex) => (
                              <li key={`received-${receivedIndex}`}>
                                <b>Sender:</b> {receivedMemo.sender}
                                {' '}
                                <b>Title:</b> {receivedMemo.title}
                                {' '}
                                <Link to={`/admin/recieve_memo/${receivedMemo._id}`} className="view-details">View Details</Link>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminReport;
