import trajectory from '../../../../src/assets/trajectory.gif'
import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'

const Page1 = ({ goToNextPage, goToPrevPage, currentPage, pages }) => {
    const sentence1 = 'In the 1970\'s Voyager 1 and 2 took advantage of a once every 175 year alignment of the planets.';
    const sentence2 = 'Each planet they passed gave the satellites a "gravity assist" on their way out of the solar system.';
    const [showSecondSentence, setShowSecondSentence] = useState(false);
  
    useEffect(() => {
      // Calculate roughly how long it will take to type the first sentence
      // (70ms per character) + 2000ms delay afterward
      const typingDelay = sentence1.length * 70 + 2000;
      const secondSentenceDelay = typingDelay + sentence2.length * 70 + 2000;
      
      // Show the second sentence after the first one has been typed
      const timer1 = setTimeout(() => {
        setShowSecondSentence(true);
      }, typingDelay);


      return () => {
        clearTimeout(timer1);
      };
    }, [sentence1]);
  
    return (
      <div className="overflow-hidden items-center"> 
        <div className="flex justify-center w-full mt-30">
          <img 
            src={trajectory} 
            alt="trajectory" 
            className="w-full max-w-2xl mx-auto"
          />
        </div>
<div className="absolute top-4/6 left-0 right-0 flex flex-col justify-center">
          <div className="text-base md:text-2xl font-bold text-center px-10">
            <div className="">
              <Typewriter
                words={[sentence1]}
                typeSpeed={70}
                delaySpeed={2000}
              />
            </div>
            {showSecondSentence && (
              <div className="mt-6">
                <Typewriter
                  words={[sentence2]}
                  typeSpeed={70}
                  delaySpeed={2000}
                />
              </div>
            )}
        </div>
        </div>
        <div className=" flex flex-col mb-10 md:mb-30 gap-2 max-w-2xl mx-auto items-center">
    
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
          <span>Next</span>
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

  export default Page1;