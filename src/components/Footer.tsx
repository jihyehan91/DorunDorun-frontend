// import { Link } from 'react-router-dom';
import { VscInfo } from 'react-icons/vsc';
import '../assets/css/footer.css';

export default function Footer() {
  return (
    <footer id='footer'>
      <div className='container'>
        {/* <Link to='/about'> */}
          <div className='footer-icon-text-group'>
            <span className='about-icon'>
              <VscInfo />
            </span>
            <span className='about-text'>© Dorun-Dorun</span>
          </div>
        {/* </Link> */}
      </div>
    </footer>
  );
}
