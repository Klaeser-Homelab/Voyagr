import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'
import icon from '../../../../src/assets/star.png'

const Page0 = ({ goToNextPage, goToPrevPage, currentPage, pages }) => {
    const sentence1 = 'Voyagr is a habit builder and a game. ';
    const sentence2 = 'It starts with a story.';
    const [showSecondSentence, setShowSecondSentence] = useState(false);
  
    useEffect(() => {
      // Calculate roughly how long it will take to type the first sentence
      // (70ms per character) + 2000ms delay afterward
      const typingDelay = sentence1.length * 70 + 2000;
      
      // Show the second sentence after the first one has been typed
      const timer = setTimeout(() => {
        setShowSecondSentence(true);
      }, typingDelay);
      
      return () => clearTimeout(timer);
    }, [sentence1]);
  
    return (
      <div className="overflow-hidden items-center h-1/2">
        <div className="flex flex-col items-center">
          <img src={icon} alt="icon" className="w-20 mx-auto" />
          <h1 className="text-2xl text-center font-bold">Welcome to Voyagr!</h1>
        </div>
        <div className="absolute top-4/6 left-0 right-0 flex flex-col justify-center text-base md:text-2xl font-bold text-center">
          <div>
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
        <div className="absolute bottom-10 md:bottom-30 left-0 right-0 flex flex-row gap-2 justify-center">
          <button
            className="h-20 text-xl text-green-600 font-bold rounded-md flex items-center animate-blink"
            onClick={goToNextPage}
          >
            <span>Begin</span>
            <ChevronRightIcon className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    );
  };
  
  export default Page0;