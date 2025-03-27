import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const Header = () => {

  const [theme, setTheme] = useState('retro')

  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Trail</Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <UserCircleIcon className="size-6" />
          </label>
          <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-64">
            <div className="collapse collapse-arrow bg-base-100">
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;