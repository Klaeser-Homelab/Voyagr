import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="App-header">
        <h1><Link to="/" className="text-white hover:text-gray-200">ManageMe</Link></h1>
    </header>
  );
}

export default Header;