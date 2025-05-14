import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseIdentitiesCard = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual identities from your context or API
  const sampleIdentities = [
    { id: 1, name: "Creative Professional", description: "Balancing creativity with business acumen" },
    { id: 2, name: "Health Enthusiast", description: "Prioritizing wellness and mindful living" },
    { id: 3, name: "Tech Innovator", description: "Driving change through technology" }
  ];
  
  const handleSeeMore = () => {
    navigate('/browse');
  };
  
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold mb-4">Browse Identities</h3>
        <p className="text-sm text-base-content opacity-70 mb-4">
          Discover popular identity frameworks from our community
        </p>
        
        <div className="space-y-3">
          {sampleIdentities.map((identity) => (
            <div key={identity.id} className="border rounded-lg p-3 hover:bg-base-200 transition-colors">
              <h4 className="font-medium text-sm">{identity.name}</h4>
              <p className="text-xs text-base-content opacity-60 mt-1">{identity.description}</p>
            </div>
          ))}
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-sm btn-outline"
            onClick={handleSeeMore}
          >
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseIdentitiesCard;