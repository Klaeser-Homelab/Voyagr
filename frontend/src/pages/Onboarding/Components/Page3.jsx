import signal from '../../../../src/assets/signal.png'
import { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'
import { useNavigate } from 'react-router-dom';

const Page3 = () => {
    const navigate = useNavigate();
    const [showSecondSentence, setShowSecondSentence] = useState(false);
    const sentence1 = 'Over 100 years after the Voyager satellites left the solar system, humanity has achieved interstellar travel. Two years ago you signed on to captain a merchant ship headed for the Alpha Centauri system. You have not seen anyone in over a year.';
    const sentence2 = 'Suddenly, you notice a faint signal.';

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                goToNextPage();
            }
            if (e.key === 'ArrowLeft') {
              goToPrevPage();
            }
        };
  
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const goToNextPage = () => {
        navigate('/chapter-one/page-4');
    }

    const goToPrevPage = () => {
        navigate('/chapter-one/page-2');
    }

  return (
    <div className="bg-black p-10 h-full">
      
      <div className="flex justify-center w-full mt-10">
          <img 
            src={signal} 
            alt="signal" 
            className="w-full max-w-2xl mx-auto"
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
            <div>
            <div className="radial-signal"></div>
            <div className="mt-6">
              <Typewriter
                words={[sentence2]}
                typeSpeed={70}
                delaySpeed={2000}
              />
            </div>
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
  <span>Investigate</span>
  <ChevronRightIcon className="w-6 h-6 ml-2" />
</button>
      
    
    </div>
    <button
        className="absolute top-10 left-0 right-0 flex flex-row gap-30 justify-center h-20 text-sm md:text-base font-bold rounded-md"
        onClick={() => navigate('/quick-start')}
      >
        Let's not, take me to the Quick Start.
      </button>
    
  </div>
    </div>
  );
};

export default Page3;