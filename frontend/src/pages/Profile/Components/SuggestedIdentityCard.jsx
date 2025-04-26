import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../context/OnboardingContext';

const SuggestedIdentityCard = ({ identity }) => {
  const { setIdentity } = useOnboarding();
  const navigate = useNavigate();
  const AddIdentity = async () => {
    console.log("Add Identity");
    setIdentity(identity);
    navigate('/quick-start/habits');
  }

  return (
    <div className="bg-gray-800 mx-2 md:mx-10 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div 
        className="px-2 cursor-pointer transition-colors duration-200 border-l-5"
        style={{ borderColor: identity.color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex py-1 gap-3 items-center">
            <h3 className="text-lg font-semibold text-white">{identity.name}</h3>
          </div>
          <button
              onClick={AddIdentity}
              className="btn bg-green-700 btn-xs text-white"
            >
              <PlusIcon className="size-5" />
              Add Identity
            </button>
          
        </div>
      </div>
    </div>
  );
};

  export default SuggestedIdentityCard;