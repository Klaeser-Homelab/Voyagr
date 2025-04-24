import floats from '../../../../src/assets/floats.png'
import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'

const Page2 = ({ goToNextPage, goToPrevPage, currentPage, pages }) => {
    const sentence1 = 'It took 41 years from 1977 to 2018 to escape the solar system. To accomplish this, Voyager\'s trajectory was meticulously planned. No more. Today it flies at over 50 thousand miles per hour going no where in particular.';
    const sentence2 = 'Where is it headed? What will it become next?';
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
    <div className="overflow-hidden">
      <div className="flex justify-center w-full mt-10">
          <img 
            src={floats} 
            alt="floats" 
            className="w-full max-w-2xl mx-auto "
          />
        </div>
  
        <div className="text-base md:text-2xl font-bold absolute top-4/6 left-0 right-0 flex flex-col justify-center text-center mx-20">
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

export default Page2;