// src/App.jsx
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar.jsx';
import SignUpForm from './components/SignUpForm/SignUpForm.jsx';
import SignInForm from './components/SignInForm/SignInForm.jsx';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import AppList from './components/AppList/AppList.jsx';
import Grainient from './components/Grainient/Grainient';
import * as appService from './services/appService.js';
import * as followUpService from './services/appFollowUp.js';
import * as checkInService from './services/checkInService.js';
import AppDetails from './components/AppDetails/AppDetails.jsx';
import AppForm from "./components/AppForm/AppForm";
import FollowUpsPage from './components/FollowUpsPage/FollowUpsPage.jsx';

import { UserContext } from './contexts/UserContext';


const App = () => {
  const { user } = useContext(UserContext);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

const handleAddApp = async (appFormData) => {
  const newApp = await appService.create(appFormData);
  setApplications([newApp, ...applications]);
  navigate("/applications");
};

const handleUpdateApp = async (appId, appFormData) => {
  try {
    const updatedApp = await appService.update(appId, appFormData);
    setApplications(applications.map((app) => (appId === app._id ? updatedApp : app)));
    navigate(`/applications/${appId}`);
    return updatedApp;
  } catch (error) {
    console.error('Error updating application:', error);
    return null;
  }
};

const handleDeleteApp = async (appId) => {
  const deletedApp = await appService.deleteApp(appId);
  if (deletedApp) {
    setApplications(applications.filter((app) => app._id !== deletedApp._id));
    navigate('/applications');
  }
  return deletedApp;
};

const handleAddFollowUp = async (followUpFormData) => {
  const { selectedAppId, ...followUpData } = followUpFormData;
  const result = await followUpService.create(selectedAppId, followUpData);
  if (result && !result.err) {
    // Stay on page and let component refresh the list
  }
};

const handleDeleteFollowUp = async (appId, followUpId) => {
  const deletedFollowUp = await followUpService.deleteFollowUp(appId, followUpId);
  return deletedFollowUp;
};

const handleUpdateFollowUp = async (appId, followUpId, followUpFormData) => {
  try {
    const updatedFollowUp = await followUpService.update(appId, followUpId, followUpFormData);
    return updatedFollowUp;
  } catch (error) {
    console.error('Error updating follow-up:', error);
    return null;
  }
};

const handleUpdateCheckIn = async (appId, checkInId, checkInFormData) => {
  try {
    const updatedCheckIn = await checkInService.update(appId, checkInId, checkInFormData);
    return updatedCheckIn;
  } catch (error) {
    console.error('Error updating check-in:', error);
    return null;
  }
};

const handleDeleteCheckIn = async (appId, checkInId) => {
  const deletedCheckIn = await checkInService.deleteCheckIn(appId, checkInId);
  return deletedCheckIn;
};

  useEffect(() => {
  const fetchAllApplications = async () => {
    const applicationData = await appService.index();

    console.log("applicationData:", applicationData);
    setApplications(applicationData);
  };
  if (user) fetchAllApplications();
}, [user]);
  
  return (
    <>
      <div className="page-background">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B19EEF"
          timeSpeed={0.15}
        />
      </div>
      {user && <NavBar />}
      <Routes>
         <Route path='/' element={user ? <Dashboard /> : <Landing /> } />
          {user ? (
          <>
          <Route path='/applications' element={<AppList applications={applications} />} />
          <Route path='/applications/:appId' element={<AppDetails handleDeleteApp={handleDeleteApp} handleUpdateCheckIn={handleUpdateCheckIn} handleDeleteCheckIn={handleDeleteCheckIn} handleUpdateFollowUp={handleUpdateFollowUp} handleDeleteFollowUp={handleDeleteFollowUp} />} />
          <Route path="/applications/new" element={<AppForm handleAddApp={handleAddApp} />} />
          <Route path="/applications/:appId/edit" element={<AppForm handleUpdateApp={handleUpdateApp} />} />
          <Route path="/follow-ups" element={<FollowUpsPage handleAddFollowUp={handleAddFollowUp} handleDeleteFollowUp={handleDeleteFollowUp} handleUpdateFollowUp={handleUpdateFollowUp} />} />
          </>
        ) : (
          <>
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        </>
        )}
      </Routes>
    </>
  );
};

export default App;

