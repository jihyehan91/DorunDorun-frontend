import axios from 'axios';

const API_URL: string = 'https://43.203.227.36.sslip.io/server';

interface UserData {
  userId: string;
  password: string;
}

export const loginApi = async (userdata: UserData) => {
  const response = await axios.post(`${API_URL}/user/login`, userdata, { withCredentials: true });
  console.log('로그인 정보 : ', response);
  console.log('유저 정보 : ', userdata);
  if (response.data.result === false) {
    alert(response.data.msg);
  } else {
    window.location.href = `https://43.203.227.36.sslip.io/`
    alert('로그인에 성공하였습니다');
  }
  return response.data;
};

export const logoutApi = async () => {
    const response = await axios.get(`${API_URL}/user/logout` , { withCredentials: true });
    window.location.href = `https://43.203.227.36.sslip.io/`
    console.log(response);
    return response.data;
};
