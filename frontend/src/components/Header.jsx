import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import ChooseTheme from './ChooseTheme';

const Header = () => {

  
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Trail</Link>
      </div>
      
      <div className="flex-none">
        <div className="dropdown dropdown-end">
        <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
    </button>
  </div>
  <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 w-64 flex flex-col">
    <Link to="/login" className="btn btn-ghost justify-start">Login</Link>
    <ChooseTheme />
  </div>
</div>
      </div>
    </header>
  );
}

export default Header;