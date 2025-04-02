import React, { createContext, useContext, useState, useEffect } from 'react';

const SelectionContext = createContext();

export const SelectionProvider = ({ children }) => {
  const [activeInput, setActiveInput] = useState(null);
  const [activeValue, setActiveValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  // Debug activeInput changes
  useEffect(() => {
    console.debug('activeInput:', activeInput?.Name || 'none');
  }, [activeInput]);

  // Debug activeValue changes
  useEffect(() => {
    console.debug('activeValue:', activeValue?.Name || 'none');
  }, [activeValue]);

  const handleValueSelect = (value) => {
    console.debug('handleValueSelect:', value);
    setActiveValue(value);
    setFilterValue(value);
    if (!value) {
      setActiveInput(null); // Clear input selection when deselecting value
    }
  };

  const handleInputSelect = (input) => {
    console.debug('handleInputSelect:', input);
    setActiveInput(input);
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  return (
    <SelectionContext.Provider value={{
      activeInput,
      activeValue,
      filterValue,
      handleValueSelect,
      handleInputSelect,
      handleFilterChange
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}; 