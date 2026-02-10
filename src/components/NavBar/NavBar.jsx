import { useContext } from 'react';
import { Link } from "react-router";

import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';
import Logo from '../../assets/images/logo-h.svg';

const NavBar = () => {
const { user, setUser } = useContext(UserContext);

const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className={styles.container}>
      <Link to='/'><img src={Logo} alt='A cute owl' /></Link>
      {user ? (
        <ul>
          <li><Link to='/applications'>Applications</Link></li>
          <li><Link to='/follow-ups'>Follow Ups</Link></li>
          <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
        </ul>
      ) : (
        <ul>
            <li><Link to="/sign-in">Sign In</Link></li>
            <li><Link to='/sign-up'>Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;