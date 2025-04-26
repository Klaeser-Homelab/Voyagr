import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '../../../context/OnboardingContext';
import { useNavigate } from 'react-router-dom';

const Page6 = () => {
    const { name } = useOnboarding();
    const playerName = name || "You"; // Fallback if name is empty

    const dialogueData = [
        { speaker: "", line: ``, color: "text-gray-400" },
        { speaker: "Voyagr", line: "How long till we get there?", color: "text-gray-400" },
        { speaker: playerName, line: "We'll be there by the new year.", color: "text-green-500" },
        { speaker: "Voyagr", line: "We might as well get to know each other then.", color: "text-gray-400" },
        { speaker: playerName, line: "I suppose so, I'm a merchant captain if you haven't figured that out yet.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Doesn't the ship drive itself?", color: "text-gray-400" },
        {speaker: "Computer", line: `I do. ${playerName} is mostly ornamental.`, color: "text-blue-500"},
        { speaker: playerName, line: "Thanks for ratting me out.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Is there anything else you're becoming? Anything you'd like to be?", color: "text-gray-400" },
        { speaker: playerName, line: "I...well.....", color: "text-green-500" },
        {speaker: "Computer", line: `What the Captain means to say is that they have some anvils in the fire.`, color: "text-blue-500"},
        { speaker: playerName, line: "Yeah, I have concepts of a plan. I just haven't gotten around to it.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Hmm, I think we're a lot alike. I'm also not sure.", color: "text-gray-400" },
        { speaker: playerName, line: "Why aren't you sure?", color: "text-green-500" },
        { speaker: "Voyagr", line: "Well, I want to be a scientist but I'm not sure I can be one.", color: "text-gray-400" },
        { speaker: playerName, line: "Since you're a probe with no engine?", color: "text-green-500" },
        { speaker: "Voyagr", line: "Yeah that's it.", color: "text-gray-400" },
        { speaker: playerName, line: "Maybe you're closer to being a scientist than you think. You have been collecting data for a long time after all.", color: "text-green-500" },
        { speaker: "Voyagr", line: "That's a good point. And maybe you're closer to being whatever it is you want to be than you think.", color: "text-gray-400" },
        { speaker: playerName, line: "Yeah, maybe.", color: "text-green-500" },
        { speaker: "Voyagr", line: "I have an idea! We can help each other out.", color: "text-gray-400" },
        { speaker: playerName, line: "How would we do that?", color: "text-green-500" },
        { speaker: "Voyagr", line: "We can pretend together. Act like the things we want to be.", color: "text-gray-400" },
        { speaker: playerName, line: "How will pretending help?", color: "text-green-500" },
        { speaker: "Voyagr", line: "Well if we pretend long enough, at some point that will just be who we are.", color: "text-gray-400" },
        { speaker: playerName, line: "....... I guess there's some sense to that.", color: "text-green-500" },
        { speaker: "Voyagr", line: "Oh yay! So are you in?", color: "text-gray-400" },
    ];

    const [displayedDialogues, setDisplayedDialogues] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const goToNextPage = () => {
        navigate('/quick-start');
    }

    const goToPrevPage = () => {
        navigate('/chapter-one/page-5');
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
                                Yeah, I'll give it a try.
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page6;