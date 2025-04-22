import React, { useState, useEffect } from 'react';
import { useValues } from '../context/ValuesContext';
import ValueForm from '../components/ValueForm';
import EditValueCard from '../components/EditValueCard';
import BreakSettingForm from '../components/BreakSettingForm';
import axios from 'axios';
import { api } from '../config/api';
import Archived from '../components/Archived';
const ProfilePage = () => {
  const { values, breaks } = useValues();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('values', values);
    console.log('breaks', breaks);
  }, [values]);
  
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
        <Archived />
    </div>
  );
};

export default ProfilePage;