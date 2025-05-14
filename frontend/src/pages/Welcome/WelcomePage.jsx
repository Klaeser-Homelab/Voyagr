import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import Header from './Components/Header';
import background from '../../assets/voyagr-background.png';
import mediumBackground from '../../assets/voyagr-background-md.png';
import extraLargeBackground from '../../assets/voyagr-background-xl.png';
import construction from '../../assets/voyagr-construction.png';
import logo from '../../assets/star.png';
import { PlayCircleIcon, FilmIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuthService } from '../../services/auth';

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();
  const navigate = useNavigate();

  function isElectron() {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  
  useEffect(() => {
    const checkTokenForFastPass = async () => {
      const authService = getAuthService();
      const token = await authService.getToken();
      if (token) {
        navigate('/home');
      }
    };
    checkTokenForFastPass();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Background div with responsive image handling */}
      <div className="flex flex-col relative">

      {/* Small screen background (default background for screens < lg) */}
      <div 
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat z-0 lg:hidden"
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Medium screen background (mediumBackground for lg <= screens < xl) */}
      <div 
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat z-0 hidden lg:block xl:hidden"
        style={{ 
          backgroundImage: `url(${mediumBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Large screen background (extraLargeBackground for xl+ screens) */}
      <div 
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat z-0 hidden xl:block"
        style={{ 
          backgroundImage: `url(${extraLargeBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: '15% center'
        }}
      ></div>
      
      {/* Content container with z-index to appear above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isElectron() && <Header className="fixed top-0 left-0 w-full z-20 hidden lg:flex"/>}

        <div className={`flex flex-col justify-center mt-15 text-5xl font-bold items-center ${isElectron() ? '' : 'lg:hidden'}`}>
          <img 
            src={logo}
            alt="Logo" 
            className="w-30 h-30 object-cover rounded-full" 
          />
          Voyagr
        </div>
        
          {/* Hero section with "Create yourself" */}
          {!isElectron() && (
          <div className="text-left mx-10 mt-90 mb-20 lg:ml-8 relative z-10 hidden lg:block">
            <h1 className="text-7xl font-bold">Create yourself</h1>
            <p className="py-6 text-xl">
              Voyagr helps you build habits that bring your ideal self to life.
            </p>
            <div className="flex flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate('/chapter-one')}
                className="btn btn-primary"
              >
                <PlayCircleIcon className="w-6 h-6" />
                New Game
              </button>
              <button 
                onClick={() => navigate('/quick-start')}
                className="btn btn-outline-primary"
              >
                <PlayCircleIcon className="w-6 h-6" />
                Quick Start
              </button>
              <button 
                onClick={() => loginWithRedirect()}
                className="btn"
              >
                <FilmIcon className="w-6 h-6" />
                Demo
              </button>
            </div>
          </div>
          )}

          <div className={`flex flex-col justify-center mt-30 gap-4 z-40 relative text-5xl font-bold items-center ${isElectron() ? '' : 'lg:hidden'}`}>
            <button 
              onClick={() => navigate('/chapter-one')}
              className="btn btn-primary w-70 h-15 text-xl"
            >
              <PlayCircleIcon className="size-10" />
              New Game
            </button>
            <button 
              onClick={() => navigate('/quick-start')}
              className="btn btn-outline-primary w-70 h-15 text-xl"
            >
              <PlayCircleIcon className="size-10" />
              Quick Start
            </button>
            <button 
              onClick={() => loginWithRedirect()}
              className="btn w-70 h-15 text-xl"
            >
              <FilmIcon className="size-10" />
              Demo
            </button>
            <button 
              onClick={async () => {
                if (isElectron()) {
                  try {
                    const result = await window.electronAPI.auth0Login();
                    console.log('Auth0 Login window opened:', result);
                  } catch (error) {
                    console.error('Error opening Auth0 Login:', error);
                  }
                } else {
                  loginWithRedirect();
                }
              }}
              className="btn btn-primary w-70 h-15 text-xl"
            >
              Load Game / Log In
            </button>
          </div>

        </div>

        
        
        {/* Features section */}
        <div className="flex-grow bg-base-200 z-20 hidden lg:block">
          <div className="flex-col lg:flex-row-reverse mx-10 mt-30">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <img 
                    src={logo}
                    alt="Logo" 
                    className="w-24 h-24 object-cover rounded-full" 
                  />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">What Voyagr does</h2>
                <ul className="space-y-4 text-xl">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Build your ideal identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Create and track habits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Grow and have fun</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-row my-30">
              <div className="flex-col lg:flex-row-reverse my-20">
                <div className="text-left lg:text-left mx-10">
                  <h1 className="text-7xl font-bold">How it's made</h1>
                  <p className="py-6 text-xl">
                    Voyagr is a learning project built by me, Reed Klaeser. Find out more about how I built it. 
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <Link to="/how-its-made" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
              </div>
              <img src={construction} alt="Logo" className="w-150 h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-center p-4 bg-base-300 text-base-content z-20 absolute bottom-0 left-0 right-0">
          <div>
            <p>
              <a 
                href="https://github.com/Klaeser-Homelab/Voyagr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary text-3xl transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-10 w-10"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;