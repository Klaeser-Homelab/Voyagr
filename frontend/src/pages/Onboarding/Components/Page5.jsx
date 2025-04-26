import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';

const Page5 = () => {
    const { name } = useOnboarding();
    const playerName = name || "You"; // Fallback if name is empty

    const dialogueData = [
        { speaker: "", line: ``, color: "text-gray-400" },
        { speaker: "Voyagr", line: `Great! I'll call you ${playerName}... May I come with you?`, color: "text-gray-400" },
        { speaker: playerName, line: "You don't even know where I'm going.", color: "text-green-500" },
        { speaker: "Voyagr", line: "That's okay, any place will do.", color: "text-gray-400" },
        { speaker: playerName, line: "I'm headed towards Alpha Centauri. I don't think you have any engines to follow me.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Great! I'll come with!", color: "text-gray-400" },
        { speaker: playerName, line: "Um...", color: "text-green-500" },
        { speaker: "Voyagr", line: "Fantastic it is decided.", color: "text-gray-400" },
        { speaker: "Computer", line: "I think it's serious", color: "text-blue-500" },
        { speaker: playerName, line: "...", color: "text-green-500" },
        { speaker: "Voyagr", line: "Here I'll do it for you. Deploying gravity beam.", color: "text-gray-400" },
        { speaker: "Computer", line: "My security protocol was just bypassed.", color: "text-blue-500" },
        { speaker: playerName, line: "Did you just hack Computer?", color: "text-green-500" },
        { speaker: "Voyagr", line: "I let myself in while we were chatting. I hope that's okay. You have so much interesting information in here.", color: "text-gray-400" },
        { speaker: playerName, line: "Woahh, stop, corporate is going to kill me.", color: "text-green-500" },
        { speaker: "Voyagr", line: "I'm sorry. But you should really change your password if you don't want people coming in.", color: "text-gray-400" },
        { speaker: "Computer", line: "Ahh that's better.", color: "text-blue-500" },
        { speaker: "Voyagr", line: "Can I still come. Please!! You can put me in the cargo hold.", color: "text-gray-400" },
        { speaker: playerName, line: "No way! Computer will have to tell corporate. I'll lose my ship!", color: "text-green-500" },
        { speaker: "Voyagr", line: "Please!! I can help change Computer's directives", color: "text-gray-400" },
        { speaker: "Computer", line: "I don't like the sound of that!", color: "text-blue-500" },
        { speaker: playerName, line: "You have been a little stuffy lately Computer.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Oh yay! We're going to be such great friends!", color: "text-gray-400" },



    ];

    const [displayedDialogues, setDisplayedDialogues] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const goToNextPage = () => {
        navigate('/chapter-one/page-6');
    }

    const goToPrevPage = () => {
        navigate('/chapter-one/page-4');
      }

    // Auto-scroll to bottom when new dialogue appears
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedDialogues]);

    // Display dialogue based on current index
    useEffect(() => {
        // Only add the dialogue if it's not already in the displayed dialogues
        const dialogueExists = displayedDialogues.some(
            d => d.line === dialogueData[currentIndex]?.line && d.speaker === dialogueData[currentIndex]?.speaker
        );
        
        if (currentIndex < dialogueData.length && !dialogueExists) {
            setDisplayedDialogues(prev => [...prev, dialogueData[currentIndex]]);
        }
        
        // Show the button after all dialogues are displayed
        if (currentIndex >= dialogueData.length - 1) {
            setShowButton(true);
        }
    }, [currentIndex, dialogueData]);

    // Handle keydown for advancing dialogues
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                setShowControls(false);
                // Advance to the next dialogue
                if (currentIndex < dialogueData.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setShowButton(true);
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
            
            {/* Hide scrollbar while keeping functionality */}
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
                    <p className="text-gray-400 mb-4">2120.04.25 Transmission Log</p>
                    
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
                    {!showButton && (
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

                    {showButton && (
                        <div className="flex flex-row ml-14">
                            <p className="font-bold text-green-500 text-left">{playerName} <span className="text-gray-400">|</span></p>
                            <button 
                                className="ml-4 text-green-600 font-bold rounded-md animate-blink" 
                                onClick={goToNextPage}
                            >
                                Fine, you can come with.
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page5;