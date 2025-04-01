import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import ChooseTheme from './ChooseTheme';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { getCurrentTheme } = useTheme();
  const currentTheme = getCurrentTheme();

  
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img 
            src={`${currentTheme.image}`}
            alt="Logo" 
            className="w-10 h-10 object-cover rounded-full" 
          />
          Journeyman
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link to="/profile">
                  Profile
              </Link>
            </li>
            <li>
              <Link to="/journey">
                Current Journey
              </Link>
            </li>
            <li>
              <Link to="/history">
                History
              </Link>
            </li>
            <li>
              <Link to="/avatar">
                Avatar
              </Link>
            </li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;