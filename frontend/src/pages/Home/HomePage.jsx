import ValueList from "./Components/ValueList";
import Today from "./Components/Today";

function HomePage() {
    return (
      <div className="flex flex-col flex-grow overflow-y-auto h-full lg:flex-row justify-between gap-20">
        <div className="radial-glow"></div>
        <div className="flex-grow flex justify-center w-full">
          <ValueList />
        </div>
        <div className="hidden lg:block w-full max-w-2xl">
          <Today />
        </div>
      </div>
    );
  }

  export default HomePage;