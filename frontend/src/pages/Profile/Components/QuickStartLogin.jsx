import { useOnboarding } from '../../../context/OnboardingContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
const QuickStartLogin = () => {
    const { identity, habit } = useOnboarding();
    const name = identity.name || '<identity>';
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        console.log('identity', identity);
        console.log('habit', habit);
    }, [identity, habit]);



    return (
        <div className="bg-black p-10 h-full flex flex-col gap-40 items-center justify-center ">
            <div className="flex flex-col gap-20 items-center text-center text-white text-2xl font-bold max-w-screen-md w-full">
            <h1>So you're going to be a {name} who is going to {habit.name} . Sounds great! Let's save your progress.</h1> 
            <div className="flex flex-col gap-4 w-full">            
            <button 
              onClick={() => loginWithRedirect({ appState: { identity, habit } })}
              className="btn btn-primary"
            >
              Save Progress / Sign Up
            </button>
          
            </div>
            </div>
        </div>
    );
}   

export default QuickStartLogin;