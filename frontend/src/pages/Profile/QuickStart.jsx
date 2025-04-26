import ValueForm from "./Components/ValueForm";
import SuggestedIdentityCard from "./Components/SuggestedIdentityCard";
import { useOnboarding } from "../../context/OnboardingContext";


const QuickStart = () => {
    const { suggestedIdentities } = useOnboarding();
    
    return (
        <div className="bg-black p-10 h-full flex flex-col gap-40 items-center justify-center ">
            <div className="flex flex-col gap-20 items-center text-white text-2xl font-bold max-w-screen-md w-full">
            <h1>So what are you hoping to become?</h1>  
            <div className="flex flex-col gap-4 w-full">
                {suggestedIdentities.map((identity) => (
                        <SuggestedIdentityCard key={identity.name} identity={identity} />                    
                ))}
            </div>
            </div>
            <ValueForm />
        </div>
    );
};  

export default QuickStart;