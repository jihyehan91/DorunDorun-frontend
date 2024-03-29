import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../hooks';
import { userNicknameCheck } from '../store/features/userIdCheck';
import '../assets/css/auth.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUserData from './UserData';



type FormData = {
  username: string;
  userId: string;
  nickname: string;
  email: string;
  password: string;
  profileImage: FileList;
};

export default function Mypage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userCheck, profileImage } = useUserData(); 

  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    watch } 
    = useForm<FormData>();

  const API_URL = 'https://43.203.227.36.sslip.io/server';

  const [getUser, setGetUser] = useState<FormData>({
    username: '',
    userId: '',
    nickname: '',
    email: '',
    password: '',
    profileImage: null
  });

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/info`);
        console.log('마이페이지:', response.data);
        setGetUser(response.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchData();
  }, []);

  // 사용자 정보 수정
  const onSubmit: SubmitHandler<FormData> = async (userdata) => {
    try {
      const formData = new FormData();
      formData.append('nickname', userdata.nickname);
      formData.append('email', userdata.email);
      formData.append('password', userdata.password);
      if (userdata.profileImage) {
        formData.append('profileImage', userdata.profileImage[0]);
      }
      const response = await axios.put(`${API_URL}/user/patch`, formData, {
        withCredentials: true
      });
      console.log('마이페이지 변경:', response.data);
      if (response.data.result === false) {
        alert(response.data.msg);
      } else {
        navigate(`/`);
        alert('수정되었습니다');
      }
      return response.data;
    } catch (error) {
      console.error('에러:', error);
    }
  };

  const nickname = watch('nickname');

  // 닉네임 중복 체크
  useEffect(() => {
    dispatch(userNicknameCheck(nickname));
  }, [nickname, dispatch]);

  // 프로필 이미지 변경
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGetUser((prevState) => ({
        ...prevState,
        profileImage: e.target.files
      }));
    }
  };

  useEffect(() => {
    setValue('nickname', getUser.nickname); 
  }, [getUser.nickname, setValue]);

  return (
    <div className='form-area'>
      <div className='form-elements'>
        <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img src={profileImage} alt='프로필 이미지'/>
          </div>

          <label className='auth-label' htmlFor='username'>
            이름
          </label>
          <input
            className='auth-input'
            value={getUser.username}
            type='text'
            id='username'
            disabled
          />

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

          <div className='relative'>
            <label className='auth-label' htmlFor='nickname'>
              닉네임
            </label>
            <input
              className='auth-input'
              type='text'
              id='nickname'
              placeholder='닉네임을 변경해주세요'
              {...register('nickname', {
                required: '닉네임을 입력해주세요'
              })}
            />
            {errors.nickname && (
              <span className='authSpan' role='alert'>
                {errors.nickname.message}
              </span>
            )}
            {nickname && (
              <span className='text-blue-500 text-xs'>
                {nickname}은(는) 사용 가능한 닉네임입니다.
              </span>
            )}
          </div>

          <div className='relative'>
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
              <span className='authSpan' role='alert'>
                {errors.email.message}
              </span>
            )}
          </div>

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
            <span className='authSpan' role='alert'>
              {errors.password.message}
            </span>
          )}

          <label className='auth-label' htmlFor='profileImage'>
            프로필 업로드
          </label>
          <input
            className='auth-input'
            type='file'
            id='profileImage'
            onChange={handleImageChange}
            accept='image/*'
          />
          <button className='auth-input mt-11' type='submit'>
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
}
