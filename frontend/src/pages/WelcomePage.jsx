import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import background from '../assets/voyagr-background.png';
import construction from '../assets/voyagr-construction.png';
import logo from '../assets/star.png';

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Background div with the image handling */}
      <div className="flex flex-col relative">

      
      <div 
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: '15% center'
        }}
      ></div>
      
      {/* Content container with z-index to appear above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header className="fixed top-0 left-0 w-full z-20"/>
        
        {/* Hero section with "Create yourself" */}
        <div className="text-left mx-10 mt-90 mb-20 lg:ml-8 relative z-10">
          <h1 className="text-7xl font-bold">Create yourself</h1>
          <p className="py-6 text-xl">
            Voyagr helps you build habits that bring your ideal self to life.
          </p>
          <div className="flex flex-row gap-4 mb-10">
            <button 
              onClick={() => loginWithRedirect()}
              className="btn btn-primary"
            >
              Get Started
            </button>
            <button 
              onClick={() => loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup"
                }
              })}
              className="btn btn-outline btn-primary"
            >
              Sign Up
            </button>
          </div>
        </div>
        </div>
        
        {/* Features section */}
        <div className="flex-grow bg-base-200 z-20">
          <div className="flex-col lg:flex-row-reverse mx-10 mt-20">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <img 
                    src={logo}
                    alt="Logo" 
                    className="w-24 h-24 object-cover rounded-full" 
                  />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">Key Features</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Build your real and ideal identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Create and track habits aligned with identities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Share your progress with your inner circle</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Configure Voyagr to your liking</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-row my-20">
              <div className="flex-col lg:flex-row-reverse my-20">
                <div className="text-left lg:text-left mx-10">
                  <h1 className="text-7xl font-bold">How it's made</h1>
                  <p className="py-6">
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
        <footer className="footer footer-center p-4 bg-base-300 text-base-content z-20">
          <div>
            <p>
              <a 
                href="https://github.com/Klaeser-Homelab/Voyagr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
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
                  className="h-5 w-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;