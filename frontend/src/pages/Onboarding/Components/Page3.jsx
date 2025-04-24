import signal from '../../../../src/assets/signal.png'
import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'

const Page3 = ({ goToNextPage, goToPrevPage, currentPage, pages }) => {
    const sentence1 = 'Over 100 years after the Voyager satellites left the solar system, man has achieved interstellar travel. You sign on to captain a merchant ship headed for the Alpha Centauri system. You have not seen anyone in over a year when all of a sudden you notice a faint signal.';

  return (
    <div className="overflow-hidden">
      <div className="radial-signal"></div>
      <div className="flex justify-center w-full mt-10">
          <img 
            src={signal} 
            alt="signal" 
            className="w-full max-w-2xl mx-auto"
          />
        </div>
  
        <div className="text-lg md:text-2xl mx-10 mt-20 text-left font-bold min-h-40">
          <div>
            <Typewriter
              words={[sentence1]}
              typeSpeed={70}
              delaySpeed={2000}
            />
          </div>
        </div>
        
        <div className="flex flex-col mb-10 md:mb-30 gap-2 max-w-2xl mx-auto items-center">
    
    <div className="absolute bottom-10 md:bottom-30 left-0 right-0 flex flex-row gap-30 justify-center">
    <button
  className="h-20 text-xl text-green-600 opacity-50 hover:opacity-100 font-bold rounded-md flex items-center"
  onClick={goToPrevPage}
>
  <ChevronLeftIcon className="w-6 h-6 ml-2" />
  <span>Back</span>
</button>
    <button
  className="h-20 text-xl text-green-600 font-bold rounded-md flex items-center animate-blink"
  onClick={goToNextPage}
>
  <span>Investigate</span>
  <ChevronRightIcon className="w-6 h-6 ml-2" />
</button>
      
    
    </div>
    <button
        className="absolute top-10 left-0 right-0 flex flex-row gap-30 justify-center h-20 text-sm md:text-base font-bold rounded-md"
        onClick={() => navigate('/quick-start')}
      >
        {pages[currentPage].quickStartButtonText}
      </button>
    
  </div>
    </div>
  );
};

export default Page3;