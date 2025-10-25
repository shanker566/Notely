import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../App'; // Import the context

function Navbar() {
  // Use the context to get the current theme and the toggle function
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Notely</h1>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        {/* Theme Toggle Button */}
        <li>
          <button 
            onClick={toggleTheme} 
            style={{ 
              padding: '8px 12px', 
              fontSize: '0.9rem',
              backgroundColor: theme === 'dark' ? '#3700b3' : '#bb86fc', 
              color: '#ffffff'
            }}
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;