import { NavLink, Link } from 'react-router-dom';
import { GoHomeFill } from 'react-icons/go';
import { CgMenuGridR } from 'react-icons/cg';
import { BiSolidChat } from 'react-icons/bi';
import { MdLibraryBooks } from 'react-icons/md';
import '../assets/css/sidebarNav.css';

const navMenu = [
  { id: 0, link: '/', icon: <GoHomeFill />, text: '두런두런' },
  { id: 1, link: '/chat', icon: <BiSolidChat />, text: '대화하기' },
  { id: 2, link: '/mylog', icon: <CgMenuGridR />, text: '나의활동' },
  { id: 3, link: '/learning', icon: <MdLibraryBooks />, text: '학습하기' },
];

export default function SidebarNav() {
  return (
    <nav className='sidebar-nav'>
      <div className='container'>
        <Link to='/'>
          <h1 className='logo'>
            <span className='nav-logo'>DoRun-DoRun</span>
            <span className='nav-logo-tablet'>DD</span>
          </h1>
        </Link>
        <ul className='sidebar-nav-menu'>
          {navMenu.map(({ id, link, icon, text }) => {
            return (
              <li className='sidebar-nav-item' key={id}>
                <NavLink
                  to={link}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <div className='icon-text-group'>
                    <div className='icon'>{icon}</div>
                    <div className='text'>{text}</div>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
