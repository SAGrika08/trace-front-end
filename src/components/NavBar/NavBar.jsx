import { useContext } from 'react';
import { Link } from "react-router";

import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
const { user } = useContext(UserContext);

  return (
    <nav>
      {user ? (
        <ul>
          <li>Welcome, {user.username}</li>
        </ul>
      ) : (
        <ul>
          <li><Link to='/sign-up'>Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;