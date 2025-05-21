import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import VoyagrAvatar from '../../../assets/voyagr_avatar.png';
import Headshot1 from '../../../assets/headshot_1.png';
import Headshot2 from '../../../assets/headshot_2.png';
import Headshot3 from '../../../assets/headshot_3.png';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Profile() {
    const { user, updateUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.display_name || '');

    // Define headshot options
    const headshotOptions = [
        { key: 'headshot1', src: Headshot1 },
        { key: 'headshot2', src: Headshot2 },
        { key: 'headshot3', src: Headshot3 }
    ];

    // Get the selected headshot from user data or default to first option
    const selectedHeadshot = user?.selectedHeadshot || 'headshot1';

    const handleSave = () => {
        // Only update if the name isn't empty
        if (displayName.trim()) {
            updateUser({ ...user, display_name: displayName });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setDisplayName(user?.display_name || '');
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-4 w-full pb-24 items-center">
            <img 
                src={headshotOptions.find(h => h.key === selectedHeadshot)?.src} 
                alt="Your avatar"
                className="w-48 h-48 rounded-full border-2 border-blue-500"
            />
            
            {isEditing ? (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="text-2xl font-semibold px-2 py-1 border border-gray-300 rounded"
                        autoFocus
                    />
                    <button 
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:text-green-800"
                    >
                        <CheckIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleCancel}
                        className="p-2 text-red-600 hover:text-red-800"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center px-4">
                    <div className="flex-grow flex justify-center">
                        <h1 className="text-4xl font-semibold">{user?.display_name}</h1>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-white hover:text-gray-800 ml-4"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}