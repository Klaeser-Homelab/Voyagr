import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { getAuthService } from './services/auth';


// Contexts
import { TimerProvider } from './context/TimerContext';
import { EventProvider } from './context/EventContext';
import { BreaksProvider } from './context/BreaksContext';
import {ValuesProvider } from './context/ValuesContext';
import { TodayProvider } from './context/TodayContext';
import { ThemeProvider } from './context/ThemeContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { TrackerProvider } from './context/TrackerContext';
import { DeveloperProvider } from './context/DeveloperContext';
import { SoundProvider } from './context/SoundContext';
import { UserProvider } from './context/UserContext';
// Pages
import HomePage from './pages/Home/HomePage';
import Today from './pages/Home/Components/Today';
import HistoryPage from './pages/Hold/HistoryPage';
import ProfilePage from './pages/Profile/ProfilePage';
import HabitPage from './pages/Profile/HabitPage';
import WelcomePage from './pages/Welcome/WelcomePage';
import BrowsePage from './pages/Profile/BrowsePage';
import Callback from './pages/Account/Callback';
import HowItsMade from './pages/Welcome/HowItsMade';
import Menu from './pages/Account/Menu';
import Settings from './pages/Account/Settings';
import ChapterOne from './pages/Onboarding/ChapterOne';
import QuickStart from './pages/Profile/QuickStart';
import Page1 from './pages/Onboarding/Components/Page1';
import Page2 from './pages/Onboarding/Components/Page2';
import Page3 from './pages/Onboarding/Components/Page3';
import Page4 from './pages/Onboarding/Components/Page4';
import Page5 from './pages/Onboarding/Components/Page5';
import Page6 from './pages/Onboarding/Components/Page6';
import QuickStartHabits from './pages/Profile/Components/QuickStartHabits';
import QuickStartLogin from './pages/Profile/Components/QuickStartLogin';
import Tracker from './pages/Home/Components/Tracker';
import ElectronLogin from './pages/Account/ElectronLogin';
import EventBar from './pages/Home/Components/EventBar';
function AuthenticatedLayout() {
  return (
    <div className="flex flex-col h-screen w-full no-scrollbar">
      <Menu />
      <div className="flex flex-grow lg:ml-15 no-scrollbar">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/today" element={<Today />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/habit/:id" element={<HabitPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <EventBar />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const authService = getAuthService();
      const token = await authService.getToken();
      if (token) {
        //console.log("Token found, setting tokenReady to true");
        setTokenReady(true);
      }
    }
    checkToken();
  }, [isAuthenticated, isLoading]);


  // Not authenticated
  if (!isAuthenticated) {
    //console.log("Not authenticated, redirecting to welcome page");
    return <WelcomePage />;
  }
  
  // Not ready with token yet
  if (!tokenReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Setting up your account...</p>
        </div>
      </div>
    );
  }
  return children;
}

function App() {
  return (
    <Auth0Provider
      domain="dev-m0q23jbgtbwidn00.us.auth0.com"
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: `https://voyagr.me/auth`,
        scope: "openid profile email"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <ThemeProvider>
        <Router>
          <DeveloperProvider>
          <SoundProvider>
          <OnboardingProvider>
          <UserProvider>
          <ValuesProvider>
          <TimerProvider>
          <TodayProvider>
            <BreaksProvider>
              <EventProvider>
              <TrackerProvider>
              <Routes>
                    {/* Public pages (no menu) */}
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/how-its-made" element={<HowItsMade />} />
                    <Route path="/chapter-one" element={<ChapterOne />} />
                    <Route path="/quick-start" element={<QuickStart />} />
                    <Route path="/quick-start/habits" element={<QuickStartHabits />} />
                    <Route path="/quick-start/login" element={<QuickStartLogin />} />
                    <Route path="/chapter-one/page-1" element={<Page1 />} />
                    <Route path="/chapter-one/page-2" element={<Page2 />} />
                    <Route path="/chapter-one/page-3" element={<Page3 />} />
                    <Route path="/chapter-one/page-4" element={<Page4 />} />
                    <Route path="/chapter-one/page-5" element={<Page5 />} />
                    <Route path="/chapter-one/page-6" element={<Page6 />} />
                    <Route path="/electronlogin" element={<ElectronLogin />} />
                    {/* Authenticated layout (with menu) */}
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <AuthenticatedLayout />
                      </ProtectedRoute>
                    } />
                  </Routes>
              </TrackerProvider>
              </EventProvider>
              </BreaksProvider>
            </TodayProvider>
          </TimerProvider>
          </ValuesProvider>
          </UserProvider>
          </OnboardingProvider>
          </SoundProvider>
          </DeveloperProvider>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App; 