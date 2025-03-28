import { useState, useEffect } from 'react';

const ChooseTheme = () => {
    const [theme, setTheme] = useState('retro')

    useEffect(() => {
      document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme])
  
    const handleThemeChange = (newTheme) => {
      setTheme(newTheme);
    };
  
  return (
            <div className="collapse collapse-arrow">
              <input type="checkbox" />
              <div className="collapse-title font-medium">Choose Theme</div>
              <div className="collapse-content">
                <fieldset className="fieldset flex flex-col gap-2">
                  <label className="flex gap-2 cursor-pointer items-center">
                    <input
                      type="radio"
                      name="theme-radios"
                      value="light"
                      className="radio radio-sm"
                      checked={theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                    />
                    Light
                  </label>
                  <label className="flex gap-2 cursor-pointer items-center">
                    <input
                      type="radio"
                      name="theme-radios"
                      value="dark"
                      className="radio radio-sm"
                      checked={theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                    />
                    Dark
                  </label>
                  <label className="flex gap-2 cursor-pointer items-center">
                    <input
                      type="radio"
                      name="theme-radios"
                      value="retro"
                      className="radio radio-sm"
                      checked={theme === 'retro'}
                      onChange={() => handleThemeChange('retro')}
                    />
                    Retro
                  </label>   
                </fieldset>
              </div>
            </div>
  );
};

export default ChooseTheme;