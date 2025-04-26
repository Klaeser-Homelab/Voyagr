import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Typewriter } from 'react-simple-typewriter'
import icon from '../../../../src/assets/star.png'
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const Page0 = () => {
    const navigate = useNavigate();
    const sentence1 = 'Voyagr is a habit builder and a game. ';
    const sentence2 = 'It starts with a story.';
    const [showSecondSentence, setShowSecondSentence] = useState(false);

     // Handle keydown for advancing dialogues
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
        navigate('/chapter-one/page-1');
    }

    const goToPrevPage = () => {
        navigate('/');
    }

  
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
        <div className="flex flex-col items-center mt-30">
          <img src={icon} alt="icon" className="w-20 mx-auto" />
          <h1 className="text-2xl text-center font-bold">Welcome to Voyagr!</h1>
        </div>
        <div className="absolute top-1/2 left-0 right-0 flex flex-col justify-center text-base md:text-2xl font-bold text-center">
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
           <div>
              <div className="flex flex-col items-center mt-30">
                <ChevronUpIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2" />
              <div className="flex flex-row justify-center">
                <ChevronLeftIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2 animate-press-blink" />
                <ChevronDownIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2" />
                <ChevronRightIcon className="w-10 h-10 text-gray-400 border-2 border-gray-400 p-2 rounded animate-press-blink" />
              </div>
              </div>
              <p className="text-gray-400 text-center ">You can also navigate with the arrow keys</p>
              </div>
        </div>
       
               
        
        <div className="flex flex-col mb-10 md:mb-30 gap-2 max-w-2xl mx-auto items-center">
    
    <div className="absolute bottom-10 md:bottom-30 left-0 right-0 flex flex-row gap-30 justify-center">
    <button
  className="h-20 text-xl text-green-600 opacity-50 hover:opacity-100 font-bold rounded-md flex items-center"
  onClick={goToPrevPage}
>
  <ChevronLeftIcon className="w-6 h-6 ml-2" />
  <span>Home</span>
</button>
    <button
  className="h-20 text-xl text-green-600 font-bold rounded-md flex items-center animate-blink"
  onClick={goToNextPage}
>
  <span>Begin</span>
  <ChevronRightIcon className="w-6 h-6 ml-2" />
</button>
      
    
    </div>
    </div>
      </div>
    );
  };
  
  export default Page0;