import { Bell, Sun, Moon, Search, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button className="header-icon-btn notification-btn" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-badge">4</span>
        </button>

        <div className="profile-wrapper" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
            aria-label="Profile menu"
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>
            <div className="profile-info">
              <span className="profile-name">
                {currentUser?.email ? currentUser.email.split('@')[0] : 'Admin'}
              </span>
              <span className="profile-role">Administrator</span>
            </div>
          </button>

          {showProfile && (
            <div className="profile-dropdown animate-scale-in">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  <User size={22} />
                </div>
                <div>
                  <p className="dropdown-name">
                    {currentUser?.email ? currentUser.email.split('@')[0] : 'Admin User'}
                  </p>
                  <p className="dropdown-email">
                    {currentUser?.email || 'admin@ecowaste.io'}
                  </p>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <User size={16} /> Profile Settings
              </button>
              <button className="dropdown-item">
                <Bell size={16} /> Notification Preferences
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
