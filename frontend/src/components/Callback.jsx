// src/components/Callback.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // or wherever you want to redirect after login
    }
  }, [isAuthenticated, navigate]);

  return <div>Loading...</div>;
}

export default Callback;