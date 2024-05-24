import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Userdashboard from './pages/user/Userdashboard';
import PrivateRoute from './components/privateroute';
import Admindashboard from '../src/pages/admin/admind';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminCreateMemo from './pages/admin/adminCreateMemo';
import PrivateRouteAdmin from './components/privateadmindashboard';
import PrivateRouteSecretary from './components/privateroutesecretary';
import PrivateRouteUser from './components/privaterouteuser';
import PrivateRouteUnregistedr from './components/privaterouteunregis';
import Secretarydashboard from './pages/secretary/secretaryDashboard';
import Adminfacultymanager from './pages/admin/adminfacultymanager';
import Unregisterdashboard from './pages/user/Unregistereduser';
import InviteMember from './pages/admin/inviteMember';
import Usermemo from './pages/user/Usermemo';
import MemoDetails from './components/Memodetails';
import AdminMemoManager from './pages/admin/adminMemomanager';
import AdminMemoDetails from './pages/admin/adminMemodetails';
import Secretarycreatememo from './pages/secretary/secretaryuploadmemo';
import Secretarymemomanager from './pages/secretary/secretarymemomanager';
import Secretarymemodetails from './pages/secretary/secretarymemodetails';
import Secretaryfacultymanager from './pages/secretary/secretaryfacultymanger';
import SecretaryRecieveMemoDetails from './pages/secretary/secretaryrecievememodetails';
import AdminRecieveMemoDetails from './pages/admin/adminrecievememodetails';
import Admincalendar from './pages/admin/admincalendar';
import Secretarycalendar from './pages/secretary/secretarycalendar';
import Usercalendar from './pages/user/usercalendar';
import AdminReport from './pages/admin/adminReport';
import AdminsentReport from './pages/admin/AdminsentReport';
import SecretaryReport from './pages/secretary/secretaryreportlist';
import SecretarysentReport from './pages/secretary/secretarysentreport';
import UserReport from './pages/user/userreportlist';

const App = () => {
  return (
    <>
      <ToastContainer />

      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <PrivateRouteUnregistedr exact path="/unregisteruser/dashboard" component={Unregisterdashboard} />


        <PrivateRouteUser exact path="/user/memo" component={Usermemo} />
        <PrivateRouteUser exact path="/user/dashboard" component={Userdashboard} />
        <PrivateRouteUser exact path="/user/memo/:memoId" component={MemoDetails} />
        <PrivateRouteUser exact path="/user/calendar" component={Usercalendar} />
        <PrivateRouteUser exact path="/user/report_list" component={UserReport} />

        <PrivateRouteAdmin exact path="/admin/dashboard" component={Admindashboard} />
        <PrivateRouteAdmin exact path="/admin/inviteMember" component={InviteMember} />
        <PrivateRouteAdmin exact path="/admin/faculty_Manager" component={Adminfacultymanager} />
        <PrivateRouteAdmin exact path="/admin/memo_create" component={AdminCreateMemo} />
        <PrivateRouteAdmin exact path="/admin/memo_manager" component={AdminMemoManager} />
        <PrivateRouteAdmin exact path="/admin/memo_Icreate/:memoId" component={AdminMemoDetails} />
        <PrivateRouteAdmin exact path="/admin/recieve_memo/:memoId" component={AdminRecieveMemoDetails} />
        <PrivateRouteAdmin exact path="/admin/calendar" component={Admincalendar} />
        <PrivateRouteAdmin exact path="/admin/report_list" component={AdminReport} />
        <PrivateRouteAdmin exact path="/admin/sent_report/:memoId" component={AdminsentReport} />

        <PrivateRouteSecretary exact path="/secretary/dashboard" component={Secretarydashboard} />
        <PrivateRouteSecretary exact path="/secretary/faculty_manager" component={Secretaryfacultymanager} />
        <PrivateRouteSecretary exact path="/secretary/memo_create" component={Secretarycreatememo}/>
        <PrivateRouteSecretary exact path="/secretary/memo_manager" component={Secretarymemomanager} />
        <PrivateRouteSecretary exact path="/secretary/memo_Icreate/:memoId" component={Secretarymemodetails} />
        <PrivateRouteSecretary exact path="/secretary/recieve_memo/:memoId" component={SecretaryRecieveMemoDetails} />
        <PrivateRouteSecretary exact path="/secretary/calendar" component={Secretarycalendar} />
        <PrivateRouteSecretary exact path="/secretary/report_list" component={SecretaryReport} />
        <PrivateRouteSecretary exact path="/secretary/sent_report/:memoId" component={SecretarysentReport} />
      </BrowserRouter>
    </>
  );
};

export default App;
