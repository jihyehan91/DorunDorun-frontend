import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useAppDispatch } from '../hooks';
import { logoutUser } from '../store/features/loginSlice';
import useUserData from '../components/UserData';
import '../assets/css/headerNav.css';
import { useEffect } from 'react';

export default function Header() {
  const {
    user,
    setUser,
    userCheck,
    setUserCheck,
    profileImage,
    setProfileImage,
  } = useUserData();

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    setUser('');
    setProfileImage('');
    setUserCheck(false);
  };

  useEffect(() => {
    setUser('');
    setProfileImage('');
    setUserCheck(false);
  }, [setUser, setProfileImage, setUserCheck]);

  return (
    <nav className='header-nav'>
      <button type="button" className="noti-icon" aria-label="알림">
        <FaBell />
      </button>
      <div className='nav-login'>
        {userCheck ? (
          <div className='flex items-center space-x-4'>
            <Link to='/mypage' className='flex items-center'>
              {user}
              {profileImage && (
                <img
                  src={profileImage}
                  alt='프로필 이미지'
                  className='ml-2 h-8 w-8 rounded-full'
                />
              )}
            </Link>
            <button
              onClick={handleLogout}
              className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded'
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link to='/login' title='로그인' className='text-gray-800 font-bold'>
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}