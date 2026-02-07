// src/App.jsx
import { Routes, Route } from 'react-router';
import NavBar from './components/NavBar/NavBar.jsx';
import SignUpForm from './components/SignUpForm/SignUpForm.jsx';

const App = () => {
  
  return (
    <>
      <NavBar />
      <h1>Hello, friend!</h1>
      <Routes>
        <Route path='/sign-up' element={<SignUpForm />} />
      </Routes>
    </>
  );
};

export default App;

