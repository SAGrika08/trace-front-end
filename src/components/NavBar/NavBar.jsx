import { useContext, useState } from 'react';
import { Link } from "react-router";

import { UserContext } from '../../contexts/UserContext';
import styles from './NavBar.module.css';
import Logo from '../../assets/images/logo-h.svg';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: '📋', label: 'Applications', path: '/applications' },
    { icon: '✅', label: 'Follow Ups', path: '/follow-ups' },
  ];

  return (
    <>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? '✕' : '☰'}
      </button>
      <nav className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.header}>
          <Link to='/' className={styles.logoLink}><img src={Logo} alt='Logo' className={styles.logo} /></Link>
        </div>

        <div className={styles.menuSection}>
          {menuItems.map((item) => (
            <Link key={item.label} to={item.path} className={styles.menuItem}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
          {user && (
            <button className={styles.menuItem} onClick={handleSignOut}>
              <span className={styles.icon}>🚪</span>
              <span className={styles.label}>Sign Out</span>
            </button>
          )}
        </div>

        {!user && (
          <div className={styles.authSection}>
            <Link to="/sign-in" className={styles.authLink}>Sign In</Link>
            <Link to='/sign-up' className={styles.authLink}>Sign Up</Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;