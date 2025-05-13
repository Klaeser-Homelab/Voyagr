import { createContext, useContext, useEffect, useState, useCallback } from "react";

const DeveloperContext = createContext();

export const DeveloperProvider = ({ children }) => {
  const [developerMode, setDeveloperMode] = useState(false);

return (
    <DeveloperContext.Provider
      value={{developerMode, setDeveloperMode}}
    >
      {children}
    </DeveloperContext.Provider>
  );
};

export const useDeveloper = () => useContext(DeveloperContext);