import axios from "axios";

const API_URL: string = 'https://43.203.227.36.sslip.io/server';
interface UserData {
  // username: string;
  userId: string;
  email: string;
  password: string;
}

const signupApi = async (userdata: UserData) => {
  try {
    console.log(userdata);
    const response = await axios.post(`${API_URL}/user/register`, userdata, { withCredentials: true });
    if (response.data) {
      alert(`안녕하세요! 회원가입 환영합니다!`);
      window.location.href = `https://43.203.227.36.sslip.io/login`
    } else {
      alert('다시 입력 부탁드립니다.');
    }
    return response.data;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

export default signupApi;
