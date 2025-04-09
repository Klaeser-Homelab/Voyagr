import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  const { loginWithRedirect } = useAuth0();
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="flex-grow bg-base-200">
        
        
        <div className="flex-col lg:flex-row-reverse mt-20">
          <div className="text-center lg:text-left lg:ml-8">
            <h1 className="text-5xl font-bold">Where are you headed?</h1>
            <p className="py-6 px-5">
              Discover your values, track your habits, and build a life aligned with what matters most to you.
              Voyagr helps you stay focused on your personal growth and create meaningful daily routines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 ml-10 mb-10">
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
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
            <div className="card-body">
              <div className="flex justify-center mb-4">
                <img 
                  src={currentTheme.image}
                  alt="Logo" 
                  className="w-24 h-24 object-cover rounded-full" 
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-6">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Define and discover your core values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Create and track habits aligned with your values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Create and track goals</span>
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
          <div className="flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left lg:ml-8">
            <h1 className="text-5xl font-bold mt-20">How it's made</h1>
            <p className="py-6">
              Voyagr is a learning project built by me, Reed Klaeser. Find out more about how I built it. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 ml-10 mb-10">
              <Link to="/how-its-made" className="btn btn-primary">Learn More</Link>
              </div>
          </div>
        </div>
        </div>
      </div>
      
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
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
  );
};

export default WelcomePage; 