import { useForm, SubmitHandler } from 'react-hook-form';
import '../assets/css/auth.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useUserData from './UserData';
import Notfound from './NotFound';

type FormData = {
  userId: string;
  email: string;
  password: string;
  // profileImage: string;
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
    password: '',
    // profileImage: ''
  });

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/info`, { withCredentials: true });
        console.log('마이페이지:', response.data);
        const userData = response.data; 
        setGetUser(userData); 
        // setValue('username', userData.username);
        setValue('userId', userData.userId);
        setValue('email', userData.email);
        setValue('password', userData.password);
        // if (userData.profileImage) {
        //   setValue('profileImage', userData.profileImage);
        // }
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchData();
  }, [setValue]);

  // 회원탈퇴
  const handleWithdraw = async (userdata: FormData) => {
    const confirmdraw = window.confirm('정말로 회원탈퇴를 하시겠습니까?');
    if (confirmdraw) {
      try {
        const response = await axios.delete(`${API_URL}/user/withdraw`, {
          data: { userId: userdata.userId }, 
          headers: {
            'Content-Type': 'application/json' 
          },
          withCredentials: true,
        });
        console.log('잘가라', response.data);
        alert('안녕히 가시오~')
        navigate('/');
      } catch (error) {
        console.error('에러:', error);
      }
    }
  };
  
  const onSubmit = () => {
    navigate('/')
  }

  // 사용자 정보 수정
  const emailChangeHandler = async (userdata: FormData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/user/changeEmail`, 
        {
          userid: userdata.userId,
          email: userdata.email,
          inputpw: userdata.password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('이메일 변경:', response.data);
      if (response.data.result === false) {
        alert(response.data.msg);
      } else {
        alert('이메일이 변경되었습니다');
      }
    } catch (error) {
      console.error('에러:', error);
    }
  };

  const passwordChangeHandler = async (userdata : FormData) => {
    const requestData = {
      userid: userdata.userId,
      email: userdata.email,
      inputpw: userdata.password
    };
  
    if (userdata.password) { 
      try {
        const response = await axios.patch(
          `${API_URL}/user/changePW`, 
          requestData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('비밀번호 변경:', response.data);
        if (response.data.result === false) {
          alert(response.data.msg);
        } else {
          alert('비밀번호가 변경되었습니다');
        }
        return response.data;
      } catch (error) {
        console.error('에러:', error);
      }
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
          {
            userCheck ?
            <div className='form-box'>
            <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
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
              <div className='flex'>
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
                <button
                  className='py-0.5 rounded border-0 text-white font-medium text-sm bg-[var(--btn-bg)] ml-1'
                  type='button' 
                  onClick={emailChangeHandler}>이메일 변경</button>
              </div>
              {errors.email && (
                <span className='authSpan' role='alert'>
                  {errors.email.message}
                </span>
              )}

              
              <label className='auth-label' htmlFor='password'>
                비밀번호
              </label>
              <div className='flex'>
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
                <button
                  className='py-0.5 rounded border-0 text-white font-medium text-sm bg-[var(--btn-bg)] ml-1'
                  type='button' 
                  onClick={passwordChangeHandler}
                >비밀번호 변경</button>
              </div>
              {errors.password && (
                <span className='authSpan' role='alert'>
                  {errors.password.message}
                </span>
              )}

              <button className='auth-input mt-11' type='submit'>
                홈으로 돌아가기
              </button>
              <p onClick={() => handleWithdraw(getUser)} className='auth-span font-black opacity-60 mb-2 text-right cursor-pointer' role='alert'>
  회원탈퇴
</p>
            </form>
          </div> 
          :
          <Notfound/>
          }
        </div>
      </div>
    </div>
  );
}
