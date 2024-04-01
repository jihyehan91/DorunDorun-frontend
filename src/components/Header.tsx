import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import { FaBars } from 'react-icons/fa6';
import '../assets/css/header.css';

interface HeaderProps {
  handler: () => void;
}

export default function Header({ handler }: HeaderProps) {
  const clickHandler = () => {
    handler();
  };

  return (
    <header id='header'>
      <div className='container'>
        <div className='header-icon'>
          <button type='button' className='bar' onClick={clickHandler}>
            <FaBars />
          </button>
          <Link to='/'>
            <h1 className='logo header'>DoRunDoRun</h1>
          </Link>
        </div>
        <HeaderNav />
      </div>
    </header>
  );
}
