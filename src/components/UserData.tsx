// useUserData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserData = () => {
  const [user, setUser] = useState('');
  const [userCheck, setUserCheck] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = 'https://43.203.227.36.sslip.io/server';
        const response = await axios.get(`${API_URL}/user/authuser`, { withCredentials: true });
        setUserCheck(response.data.result);
        setUser(response.data.nickname || '');
        setProfileImage(response.data.profileImageUrl || ''); 
      } catch (error) {
        console.error('에러가 발생했습니다:', error);
      }
    };
    fetchData();
  }, []); 

  return { user, userCheck, profileImage };
};

export default UserData;
