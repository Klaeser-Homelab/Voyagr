import React, { useState, useEffect } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueForm from './Components/ValueForm';
import EditValueCard from './Components/EditValueCard';
import BreakSettingForm from './Components/BreakSettingForm';
import Archived from './Components/Archived';

const ProfilePage = () => {
  const { values, breaks } = useValues();
  const [error, setError] = useState(null);
  
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-screen-2xl">
      <div className="flex flex-col mx-2 md:mx-10 mt-5">
          <ValueForm />
      </div>
      <div className="flex flex-col gap-1 mx-2 md:mx-10">
        {values.map((value) => (
          <EditValueCard
            key={value.id}
            value={value}
          />
        ))}
      </div>
      <div className="flex flex-col mx-2 md:mx-10">
        <BreakSettingForm />
      </div>
      <div className="flex flex-col mx-2 md:mx-10">
        <Archived />
      </div>
    </div>
  );
};

export default ProfilePage;