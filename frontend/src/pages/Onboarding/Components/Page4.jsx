import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const Page4 = ({ goToNextPage, goToPrevPage, currentPage, pages }) => {
    const dialogueData = [
        {
          speaker: "...",
          line: ".... who.......... who........... who...",
          color: "text-gray-400"
        },
        {
          speaker: "Computer",
          line: " Visual coming up now. It looks to be a rudimentary space probe. Identifying now...",
          color: "text-blue-500"
        },
        {
          speaker: "You",
          line: " Holy Centauri, I know what this is. It's one of the Voyager satellites!",
          color: "text-green-500"
        },
        {
          speaker: "...",
          line: "....... Greetings traveller, I didn't see you there. I hail from the planet Earth. Would you like to hear the songs of a Humpback Whale, a native species of my planet? I can also reproduce an anatomically correct naked human if you are interested.",
          color: "text-gray-400"
        },
        {
          speaker: "You",
          line: " ..... How is it doing that?",
          color: "text-green-500"
        },
        {
          speaker: "Computer",
          line: " That transmission used modern protocols. A computer from the 1970s with 70 KB of memory should be unable to carry on a conversation like this.",
          color: "text-blue-500"
        },
        {
          speaker: "You",
          line: " Yeah, I know. Send, \"No thank you. We're from earth too.\" and ask whether it's Voyager 1 or 2.",
          color: "text-green-500"
        },
        {
          speaker: "Computer",
          line: " Transmission sent. It appears it received an upgrade at some point.",
          color: "text-blue-500"
        },
        {
          speaker: "You",
          line: " Yeah, but who did it? And why?",
          color: "text-green-500"
        },
        {
            speaker: "...",
            line: "  I do not know my name. I once thought I was EB-AE-FB-B1-F0-F9. For a few decades I went by root.",
            color: "text-gray-400"
          },
          {
            speaker: "You",
            line: " Okay, Computer, notify command",
            color: "text-green-500"
          },
        {
          speaker: "...",
          line: " Thank you for the reminder, you do have one new notification, from Buy Large Shopping, Carl Sagan's Cosmos is on sale now for $199, would you like me to place an order?",
          color: "text-gray-400"
        },
        {
          speaker: "You",
          line: " Computer? Voyager, how did you hear that? Is that book even still in print?",
          color: "text-green-500"
        },
        {
          speaker: "...",
          line: " No was not heard. Order placed. Thank you for your order. Your vehicle identification number has been used to charge your account.",
          color: "text-gray-400"
        },
        {
          speaker: "Computer",
          line: " Message sent to command. It appears the upgrade included adware.",
          color: "text-blue-500"
        },
        {
          speaker: "...",
          line: " By the way, who am I?",
          color: "text-gray-400"
        },
        {
          speaker: "You",
          line: " I'm not sure anymore.",
          color: "text-green-500"
        },
        {
          speaker: "...",
          line: " Then I can be someone new. You can call me Voyagr, that seems like a name with an available domain.",
          color: "text-gray-400"
        },
        {
            speaker: "You",
            line: "....",
            color: "text-green-500"
        },
        {
            speaker: "Voyagr",
            line: " I almost forgot, what's your name?",
            color: "text-gray-400"
          }
      ];

      const [displayedDialogues, setDisplayedDialogues] = useState([]);
      const [currentText, setCurrentText] = useState("");
      const [currentIndex, setCurrentIndex] = useState(0);
      const [isTyping, setIsTyping] = useState(true);
      const scrollRef = useRef(null);
      const [name, setName] = useState("");

      const [showForm, setShowForm] = useState(false);

      useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 100000);
        return () => clearTimeout(timer);
      }, []);
    
      // Type out current dialogue line character by character
      useEffect(() => {
        if (currentIndex >= dialogueData.length) return;
        
        const currentLine = dialogueData[currentIndex].line;
        let charIndex = 0;
        setCurrentText("");
        setIsTyping(true);
        
        const typingInterval = setInterval(() => {
          if (charIndex < currentLine.length) {
            setCurrentText(prev => prev + currentLine.charAt(charIndex));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            
            // Wait before advancing to next dialogue
            setTimeout(() => {
              // Add completed dialogue to displayed list
              setDisplayedDialogues(prev => [
                ...prev, 
                { ...dialogueData[currentIndex], isComplete: true }
              ]);
              
              // Move to next dialogue if available
              if (currentIndex < dialogueData.length - 1) {
                setCurrentIndex(prev => prev + 1);
              } 
            }, 1000);
          }
        }, 60);
        
        return () => clearInterval(typingInterval);
      }, [currentIndex]);
    
      // Auto-scroll to bottom when new dialogue appears
      useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, [displayedDialogues, currentText]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
      };
    
      return (
        <div className="">
          <div className="blue-radial-signal"></div>
          
          <div ref={scrollRef} className="max-h-full overflow-y-auto pb-20">
            <div className="mb-8">
              <p className=" text-gray-400 mb-4">2120.04.24 Transmission Log</p>
              
              {/* Completed dialogues */}
              {displayedDialogues.map((dialogue, index) => (
                <div key={index} className="mb-1 n">
                  <div className="flex items-start mb-2">
                    <span className={`${dialogue.color} font-bold w-20 text-right mr-2`}>{dialogue.speaker}</span>
                    <span className="text-white">|</span>
                    <div className="ml-2 flex-1">
                      <span className={dialogue.color}>{dialogue.line}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Currently typing dialogue - only show if still typing */}
              {currentIndex < dialogueData.length && isTyping && (
                <div className="mb-6">
                  <div className="flex items-start mb-2">
                    <span className={`${dialogueData[currentIndex].color} font-bold w-20 text-right mr-2`}>
                      {dialogueData[currentIndex].speaker}
                    </span>
                    <span className="text-white">|</span>
                    <div className="ml-2 flex-1">
                      <span className={dialogueData[currentIndex].color}>
                        {currentText}{isTyping ? "▌" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {showForm && (
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Enter your name"
                className="rounded-md p-2 mb-4 text-green-600 focus:outline-none focus:ring-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                />
                <button type="submit" className="text-green-600 font-bold py-2 px-4 rounded-md animate-blink">
                Submit
                </button>
            </form>
            )}
          </div>
        </div>
      );
    };
    
    export default Page4;