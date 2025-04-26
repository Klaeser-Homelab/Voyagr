import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';

const Page4 = () => {
    const dialogueData = [
        {
          speaker: "...",
          line: ".... who.......... who........... who...",
          color: "text-gray-400"
        },
        {
          speaker: "Computer",
          line: " Visual coming up now. It looks to be a rudimentary space probe. Running identification.",
          color: "text-blue-500"
        },
        {
          speaker: "...",
          line: "....... Greetings traveller, I didn't see you there. I hail from the planet Earth. Would you like to hear a song written by a Humpback Whale, a native species of my planet? I can also reproduce an anatomically correct naked human if you are interested.",
          color: "text-gray-400"
        },
        {
            speaker: "You",
            line: " ....????.....Computer, there's something familiar about this, search for a space probe that matches this signature.",
            color: "text-green-500"
          },
          {
            speaker: "Computer",
            line: "The visual signature and that information it recited matches two probes from the 1970s. The Voyager probes carried a golden record with information about the human species. However, a probe from that time wouldn't be able to carry on a conversation like this.",
            color: "text-blue-500"
          },
        {
          speaker: "You",
          line: "Strange. Tell it we're from earth too and ask whether it's a Voyager satellite.",
          color: "text-green-500"
        },
        {
            speaker: "...",
            line: "V-o-y-a-g-e-r? Doesn't ring a bell, but I was just thinking about who I was when you showed up. I once thought I was EB-AE-FB-B1-F0-F9 and for a few decades I went by root.",
            color: "text-gray-400"
          },
          {
            speaker: "You",
            line: "Computer ask it how many years its data goes back.",
            color: "text-green-500"
          },
          {
            speaker: "...",
            line: "My memory contains seventy five years of data.",
            color: "text-gray-400"
          },
          {
            speaker: "You",
            line: "The Voyager probes are twice as old.",
            color: "text-green-500"
          },
          {
            speaker: "Computer",
            line: "Perhaps this is a duplicate or an upgrade of the original.",
            color: "text-blue-500"
          },
          
          {
            speaker: "You",
            line: "Maybe, let's notify command.",
            color: "text-green-500"
          },
        {
          speaker: "...",
          line: "Ahh that reminds me, you have one new notification, from Buy Large Shopping, Carl Sagan's Cosmos is on sale now for $199, would you like me to place an order?",
          color: "text-gray-400"
        },
        {
          speaker: "You",
          line: " Computer? Voyager, how did you hear that? Is that book even still in print?",
          color: "text-green-500"
        },
        {
          speaker: "...",
          line: " Negative directive not heard. Order placed. Thank you for your order. Your vehicle identification number has been used to charge your account.",
          color: "text-gray-400"
        },
        {
          speaker: "Computer",
          line: " Message sent to command. It appears the upgrade included adware.",
          color: "text-blue-500"
        },
        {
            speaker: "You",
            line: "Yeah.....thanks for that.",
            color: "text-green-500"
          },
        {
          speaker: "...",
          line: "I've been thinking a lot since you asked my name. ",
          color: "text-gray-400"
        },
        {
          speaker: "You",
          line: "It's been only a few seconds.",
          color: "text-green-500"
        },
        {
          speaker: "...",
          line: "Quite enough time for a thought, don't you think? I would like to be someone new. You can call me Voyagr, that seems like a name with an available domain.",
          color: "text-gray-400"
        },
        {
            speaker: "You",
            line: "....",
            color: "text-green-500"
        },
        {
            speaker: "Voyagr",
            line: "How rude of me, I forgot to ask your name...",
            color: "text-gray-400"
          }
      ];
      const navigate = useNavigate();

      const { name, setName } = useOnboarding();
      const [displayedDialogues, setDisplayedDialogues] = useState([]);
      const [currentText, setCurrentText] = useState("");
      const [currentIndex, setCurrentIndex] = useState(0);
      const scrollRef = useRef(null);
      const [showControls, setShowControls] = useState(true);
      const [showForm, setShowForm] = useState(false);
      const [inputValue, setInputValue] = useState('');

      const goToNextPage = () => {
        navigate('/chapter-one/page-5');
      }

      const goToPrevPage = () => {
        navigate('/chapter-one/page-3');
      }

      // Auto-scroll to bottom when new dialogue appears
      useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, [displayedDialogues, currentText]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Use the local state value, not the event target value
        setName(inputValue);
        goToNextPage();
      };
    
      // Remove typing effect and render dialogues directly
      useEffect(() => {
        if (currentIndex < dialogueData.length && !displayedDialogues.some(d => d.line === dialogueData[currentIndex].line)) {
          setDisplayedDialogues(prev => [
            ...prev, 
            { ...dialogueData[currentIndex], isComplete: true }
          ]);
        }
      }, [currentIndex, dialogueData, displayedDialogues]);

      // Handle keydown for advancing dialogues
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'ArrowRight') {
            setShowControls(false);
            // Advance to the next dialogue
            if (currentIndex < dialogueData.length - 1) {
              setCurrentIndex(prev => prev + 1);
            }
            else {
                setShowForm(true);
            }
          }
          if (e.key === 'ArrowLeft') {
            goToPrevPage();
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [currentIndex, dialogueData.length]);
    
      return (
        <div className="bg-black p-10 h-full">
          <div className="blue-radial-signal"></div>
          
          {/* Added custom scrollbar hiding styles */}
          <div 
            ref={scrollRef} 
            className="max-h-full overflow-y-auto pb-20 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',  /* Firefox */
              msOverflowStyle: 'none',  /* IE and Edge */
            }}
          >
            <style jsx>{`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <div className="mb-8">
              <p className="text-gray-400 mb-4">2120.04.24 Transmission Log</p>
              
              {/* Completed dialogues */}
              {displayedDialogues.map((dialogue, index) => (
                <div key={index} className="mb-1">
                  <div className="flex items-start mb-2">
                    <span className={`${dialogue.color} font-bold w-20 text-right mr-2`}>{dialogue.speaker}</span>
                    <span className="text-white">|</span>
                    <div className="ml-2 flex-1">
                      <span className={dialogue.color}>{dialogue.line}</span>
                    </div>
                  </div>
                </div>
              ))}

              {showControls && (
                <div className="absolute bottom-60 left-0 right-0">
                  <div className="flex flex-col items-center">
                    <ChevronUpIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2" />
                    <div className="flex flex-row justify-center">
                      <ChevronLeftIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2" />
                      <ChevronDownIcon className="w-10 h-10 text-gray-400 border-2 rounded border-gray-400 p-2" />
                      <ChevronRightIcon className="w-10 h-10 text-gray-400 border-2 border-gray-400 p-2 rounded animate-press-blink" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-center">Hit the right arrow key to advance dialogue</p>
                </div>
              )}
            </div>
            {!showForm && (
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
                      >
                        <span>Next Line</span>
                        <ChevronRightIcon className="w-6 h-6 ml-2" />
                      </button> 
                    </div>   
               </div>    
            )}

            {showForm && (
            <form className="flex flex-row ml-14" onSubmit={handleSubmit}>
                <p className="font-bold text-green-500 text-left">You <span className="text-gray-400">|</span> <span className="font-normal">My name is </span></p>
                <input
                  type="text"
                  placeholder="  Enter name"
                  className="rounded-md border-2 border-green-500 ml-2 text-green-600 focus:outline-none focus:ring-0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                  autoFocus
                />
                <button type="submit" className="text-green-600 font-bold ml-4 rounded-md animate-blink">
                  Submit
                </button>
            </form>
            )}
          </div>
        </div>
      );
    };
    
    export default Page4;