import React, { useState } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueForm from './Components/ValueForm';
import EditValueCard from './Components/EditValueCard';
import BreakSettingForm from './Components/BreakSettingForm';
import Archived from './Components/Archived';
import BrowseIdentitiesCard from './Components/BrowseIdentitiesCard';
import ProfileOnboard from './Components/ProfileOnboard';
import { useUser } from '../../context/UserContext';
import Profile from './Components/Profile';

const ProfilePage = () => {
  const { values } = useValues();
  const [error, setError] = useState(null);
  const { user, isOnboardingPageCompleted } = useUser();
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  
  return (
    <div className="flex flex-col gap-4 w-full mx-5 md:ml-30 md:mr-20 pb-24 items-center">
      <div className="items-center w-full mx-10">
        {/* ValueList Onboarding Modal */}
        <div className="flex flex-col mx-2 md:mx-0 mt-5">
          <ValueForm />
          <Profile />
        </div>
        {user && !isOnboardingPageCompleted(3) && (
          <ProfileOnboard 
          />
        )}

        <div className="flex flex-col gap-1 mx-2 md:mx-0 mt-4">
          {values.map((value) => (
            <EditValueCard
              key={value.id}
              value={value}
            />
          ))}
        </div>
        <div className="flex flex-col mx-2 md:mx-0 mt-4">
          <BreakSettingForm />
        </div>
        <div className="flex flex-col mx-2 md:mx-0 mt-4">
          <BrowseIdentitiesCard />
        </div>
        <div className="flex flex-col mx-2 md:mx-0 mt-4">
          <Archived />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;