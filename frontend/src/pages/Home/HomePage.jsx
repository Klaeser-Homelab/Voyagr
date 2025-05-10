import ValueList from "./Components/ValueList";
import Today from "./Components/Today";
import { useContext, useEffect } from "react";
import { useValues } from "../../context/ValuesContext";


function HomePage() {
    const { fetchAll } = useValues();
    useEffect(() => {
        fetchAll();
    }, []);
    return (
      <div className="flex flex-col flex-grow h-full lg:flex-row justify-between gap-20">
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