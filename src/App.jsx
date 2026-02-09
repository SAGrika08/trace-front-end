// src/App.jsx
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar.jsx';
import SignUpForm from './components/SignUpForm/SignUpForm.jsx';
import SignInForm from './components/SignInForm/SignInForm.jsx';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import AppList from './components/AppList/AppList.jsx';
import * as appService from './services/appService.js';
import * as followUpService from './services/appFollowUp.js';
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
      <NavBar />
      <Routes>
         <Route path='/' element={user ? <Dashboard /> : <Landing /> } />
          {user ? (
          <>
          <Route path='/applications' element={<AppList applications={applications} />} />
          <Route path='/applications/:appId' element={<AppDetails/>} />
          <Route path="/applications/new" element={<AppForm handleAddApp={handleAddApp} />} />
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

