import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


export default function ElectronLogin() {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
   console.log('Will login with redirect');
   loginWithRedirect();
  }, []);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}