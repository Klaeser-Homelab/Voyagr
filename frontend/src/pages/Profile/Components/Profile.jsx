import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';

export default function Profile() {
    const { user } = useUser();

  // Define headshot options
  const headshotOptions = [
    { key: 'headshot1', src: Headshot1 },
    { key: 'headshot2', src: Headshot2 },
    { key: 'headshot3', src: Headshot3 }
  ];

   // Get the selected headshot from user data or default to first option
   const selectedHeadshot = user?.selectedHeadshot || 'headshot1';

  return (
    <div className="flex flex-col gap-4 w-full pb-24 items-center">
      <img 
        src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
        alt="Your avatar"
        className="w-48 h-48 rounded-full border-2 border-blue-500"
      />
            <h1 className="text-4xl font-semibold">{user.display_name}</h1>
    </div>
  );
}