import { useForm } from 'react-hook-form';
import '../assets/css/auth.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useUserData from './UserData';
// import Notfound from './NotFound';

type FormData = {
  userId: string;
  email: string;
  password: string;
};

export default function Mypage() {
  const navigate = useNavigate();
  const { userCheck } = useUserData();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const API_URL = 'https://43.203.227.36.sslip.io/server';

  const [getUser, setGetUser] = useState<FormData>({
    userId: '',
    email: '',
    password: ''
  });

  //auth 유저 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/info`, { withCredentials: true });
        const userData = response.data; 
        setGetUser(userData); 
        setValue('userId', userData.userId);
        setValue('email', userData.email);
        setValue('password', userData.password);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchData();
  }, [setValue]);

  //비밀번호 변경
  const handlePasswordChange = async (userdata: FormData) => {
    try {
      const requestData = {
        userid: userdata.userId,
        email: userdata.email,
        inputpw: userdata.password
      };

      const passwordResponse = await axios.patch(`${API_URL}/user/changePW`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (passwordResponse.data.result === false) {
        alert(passwordResponse.data.msg);
      } else {
        navigate(`/`);
        alert('비밀번호가 변경되었습니다');
      }
    } catch (error) {
      console.error('에러:', error);
    }
  };

  return (
    <div className='form-container'>
      <div className='form-area signup'>
        <div className='form-elements'>
          <div className='form-title signup py-5'>
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          {userCheck && (
            <div className='form-box'>
              <h2 className='font-bold mb-2'>프로필 수정</h2>
              <p className='text-sm text-gray-400'>DoRun-DoRun 비밀번호를 수정 하실 수 있습니다.</p>
              
              {/* 비밀번호 변경 폼 */}
              <label className='auth-label' htmlFor='userId'>
                  아이디
                </label>
                <input
                  className='auth-input'
                  value={getUser.userId}
                  type='text'
                  id='userId'
                  disabled
                />

                <label className='auth-label' htmlFor='email'>
                  이메일
                </label>
                <input
                  className='auth-input'
                  type='email'
                  id='email'
                  placeholder='이메일을 변경해주세요'
                  {...register('email', {
                    required: '이메일을 입력해주세요',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: '유효한 이메일 주소를 입력하세요'
                    }
                  })}
                />
                {errors.email && (
                  <span className='authSpan text-blue-500 text-xs' role='alert'>
                    {errors.email.message}
                  </span>
                )}

              <form className='auth-form' onSubmit={handleSubmit(handlePasswordChange)}>
                <label className='auth-label' htmlFor='password'>
                  비밀번호
                </label>
                <input
                  className='auth-input'
                  type='password'
                  id='password'
                  placeholder="'영문, 숫자, 대문자, 특수문자 포함 8자리 이상'"
                  {...register('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다'
                    },
                    validate: (value) => {
                      const pwNumber = /\d/.test(value);
                      const pwUpperCase = /[A-Z]/.test(value);
                      const pwLowerCase = /[a-z]/.test(value);
                      const pwSpecialChar = /[!@#$%^&*]/.test(value);
                      return (
                        pwNumber &&
                        pwUpperCase &&
                        pwLowerCase &&
                        pwSpecialChar ||
                        '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다'
                      );
                    }
                  })}
                />
                {errors.password && (
                  <span className='authSpan text-blue-500 text-xs' role='alert'>
                    {errors.password.message}
                  </span>
                )}

                <button className='auth-input mt-11' type='submit'>
                  비밀번호 변경하기
                </button>

                  <Link to='/mypage'>
                  <p className='auth-span text-blue-500 font-black mb-2 text-right cursor-pointer' role='alert'>
                    이메일 변경하기
                  </p>
                  </Link>
              </form>
            </div> 
          )}
        </div>
      </div>
    </div>
  );
}
