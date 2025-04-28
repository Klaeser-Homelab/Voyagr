import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../../assets/star.png';
import { useNavigate } from 'react-router-dom';
import { PlayCircleIcon } from '@heroicons/react/24/outline';

const Header = ({className}) => {
  const { loginWithRedirect, user } = useAuth0();
  const navigate = useNavigate();

  function isElectron() {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }
  
  return (
    <header className={`navbar shadow-md ${className}`}>
      <div className="flex-1">
        <Link to="/" className="flex items-center text-xl">
          <img 
            src={logo}
            alt="Logo" 
            className="w-10 h-10 object-cover rounded-full" 
          />
          Voyagr
        </Link>
      </div>
      <div className="flex gap-2">
            <button 
              onClick={() => navigate('/chapter-one')}
              className="btn btn-primary"
            >
              <PlayCircleIcon className="w-6 h-6" />
              New Game
            </button>
            <button 
              onClick={() => navigate('/quick-start')}
              className="btn"
            >
              <PlayCircleIcon className="w-6 h-6" />
              Quick Start
            </button>
            <button 
              onClick={async () => {
                if (isElectron() && window.electronAPI) {
                  try {
                    console.log('Opening Gmail...');
                    const result = await window.electronAPI.auth0Login();
                    console.log('Auth0 Login window opened:', result);
                  } catch (error) {
                    console.error('Error opening Auth0 Login:', error);
                  }
                } else {
                  // Regular web fallback
                  window.open('https://mail.google.com', '_blank');
                }
              }}
              className="btn btn-outline btn-primary"
            >
              Open Gmail
            </button>
      </div>
    </header>
  );
};

export default Header;