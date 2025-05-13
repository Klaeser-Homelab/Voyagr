import React, { useState, useEffect } from 'react';
import { useValues } from '../../context/ValuesContext';
import ValueForm from './Components/ValueForm';
import EditValueCard from './Components/EditValueCard';
import BreakSettingForm from './Components/BreakSettingForm';
import Archived from './Components/Archived';
import Browse from './Components/Browse';

const ProfilePage = () => {
  const { values, breaks } = useValues();
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myValues'); // Default tab
  
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'browse':
        return <Browse />;
      case 'myValues':
        return (
          <>
            <div className="flex flex-col mx-2 md:mx-0 mt-5">
              <ValueForm />
            </div>
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
              <Archived />
            </div>
          </>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-screen-2xl pb-24">
      {/* Tabs */}
      <div className="tabs tabs-boxed mx-2 md:mx-10 mt-5 bg-base-200">
        <a 
          className={`tab ${activeTab === 'browse' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Identities
        </a>
        <a 
          className={`tab ${activeTab === 'myValues' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('myValues')}
        >
          My Identities
        </a>
      </div>
      
      {/* Tab Content Container */}
      <div className="mx-2 md:mx-10">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfilePage;