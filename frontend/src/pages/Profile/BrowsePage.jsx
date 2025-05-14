import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const carouselRef = useRef(null);

  // Identity categories and their items
  const categories = [
    {
      id: 'personal',
      title: 'Personal Identities',
      identities: [
        { id: 'artist', name: 'Artist', color: '#F87171', description: 'Express creativity through various art forms' },
        { id: 'runner', name: 'Runner', color: '#60A5FA', description: 'Maintain fitness through running activities' },
        { id: 'homemaker', name: 'Homemaker', color: '#34D399', description: 'Create and maintain a comfortable home' },
        { id: 'chef', name: 'Chef', color: '#FBBF24', description: 'Create delicious and nutritious meals' },
        { id: 'student', name: 'Student', color: '#A78BFA', description: 'Continuously learn and grow knowledge' },
        { id: 'traveler', name: 'Traveler', color: '#EC4899', description: 'Explore new places and cultures' }
      ]
    },
    {
      id: 'relationship',
      title: 'Relationship Identities',
      identities: [
        { id: 'attentive-partner', name: 'Attentive Partner', color: '#F472B6', description: 'Build a loving and supportive relationship' },
        { id: 'parent', name: 'Parent', color: '#38BDF8', description: 'Nurture and guide children' },
        { id: 'friend', name: 'Friend', color: '#4ADE80', description: 'Foster meaningful and supportive friendships' },
        { id: 'team-player', name: 'Team Player', color: '#FB923C', description: 'Contribute positively to groups and teams' },
        { id: 'mentor', name: 'Mentor', color: '#C084FC', description: 'Guide and support others in growth' },
        { id: 'community-member', name: 'Community Member', color: '#2DD4BF', description: 'Contribute to your local community' }
      ]
    },
    {
      id: 'professional',
      title: 'Professional Identities',
      identities: [
        { id: 'developer', name: 'Engineer', color: '#22D3EE', description: 'Build products and solutions' },
        { id: 'manager', name: 'Manager', color: '#F87171', description: 'Lead teams to achieve goals' },
        { id: 'entrepreneur', name: 'Entrepreneur', color: '#FACC15', description: 'Create and grow a business' },
        { id: 'content-creator', name: 'Content Creator', color: '#C084FC', description: 'Produce valuable digital content' },
        { id: 'researcher', name: 'Researcher', color: '#4ADE80', description: 'Discover new knowledge and insights' },
        { id: 'consultant', name: 'Consultant', color: '#60A5FA', description: 'Provide expert guidance to clients' }
      ]
    }
  ];

  // Filter identities based on search term
  const filteredCategories = searchTerm ? 
    categories.map(category => ({
      ...category,
      identities: category.identities.filter(identity => 
        identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        identity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.identities.length > 0) 
    : categories;

  // Scroll the carousel left or right
  const scroll = (direction, categoryId) => {
    const container = document.getElementById(`carousel-${categoryId}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -container.clientWidth / 2 : container.clientWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle identity card click
  const handleIdentityClick = (identity) => {
    console.log('Selected identity:', identity);
    // Implement your navigation or selection logic here
  };

  // Handle add button click
  const handleAddClick = (e, identity) => {
    e.stopPropagation(); // Prevent card click
    console.log('Add identity:', identity);
    // Implement add functionality here
  };

  return (
    <div className="bg-base-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browse Identities</h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-base-content/50" />
          </div>
          <input
            type="text"
            className="input input-bordered w-full pl-10 focus:outline-none"
            placeholder="Search identities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Categories and Carousels */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <div key={category.id} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
              
              {/* Carousel Container */}
              <div className="relative group">
                {/* Left scroll button */}
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-base-300 rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => scroll('left', category.id)}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                
                {/* Carousel */}
                <div 
                  id={`carousel-${category.id}`}
                  className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {category.identities.map(identity => (
                    <div 
                      key={identity.id} 
                      className="snap-start shrink-0 z-0 relative group/card"
                      style={{ width: 'calc(25% - 12px)', minWidth: '250px' }}
                    >
                      {/* Card with hover expansion */}
                      <div 
                        className="card bg-base-200 shadow-xl hover:bg-base-300 transition-all duration-300 cursor-pointer
                                  h-48 group-hover/card:h-100 group-hover/card:w-[120%]  group-hover/card:absolute 
                                  group-hover/card:z-10 overflow-hidden group-hover/card:-translate-x-[10%]"
                        onClick={() => handleIdentityClick(identity)}
                        style={{ borderLeft: `8px solid ${identity.color}` }}
                      >
                        <div className="card-body p-4">
                          <h3 className="card-title">{identity.name}</h3>
                          <p className="line-clamp-3 text-base-content/70">{identity.description}</p>
                          
                          {/* Add button - always visible */}
                          <div className="absolute top-4 right-4">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={(e) => handleAddClick(e, identity)}
                            >
                              Add
                            </button>
                          </div>
                          
                          {/* Extra content - only visible on hover */}
                          <div className="mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                            <h4 className="font-semibold mb-1">Additional Details:</h4>
                            <p className="text-base-content/70">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Right scroll button */}
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-base-300 rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => scroll('right', category.id)}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-base-content/70">No identities match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}