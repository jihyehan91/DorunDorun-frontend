import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { loginUser } from '../store/features/loginSlice';
import { useAppDispatch } from '../hooks';
import '../assets/css/auth.css';
import { useState } from 'react';

// 임시 발표용 계정
const testUsers = [
  {
    testID:'BBQ999',
    testPW:'gHTJD1358!',
  },
  {
    testID:'BHC999',
    testPW:'gHTJD1358!',
  },
  {
    testID:'KYOCHON999',
    testPW:'gHTJD1358!',
  },
  {
    testID:'GCOVA999',
    testPW:'gHTJD1358!',
  },
  {
    testID:'HOSIGI999',
    testPW:'gHTJD1358!',
  },
]

const getRandomUser = () => {
  const randomNum = Math.floor(Math.random() * testUsers.length);
  console.log(testUsers[randomNum])
  console.log(testUsers)
  return testUsers[randomNum];
  
};
////////////////////////////////////////////////////////////

type FormData = {
  userId: string;
  password: string;
};

export default function Login() {
  const [randomUser, setRandomUser] = useState(getRandomUser());//발표 끝나면 삭제
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (userData) => {
    console.log('onSubmit', userData);
    dispatch(loginUser(userData));
  };

  const onError: SubmitErrorHandler<FormData> = (errors) => {
    console.log('onError', errors);
  };
  
  return (
    <div className='form-container'>
      <div className='form-area'>
        <div className='form-elements'>
          <div className='form-title'>
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          <div className='form-box'>
            <form
              className='auth-form'
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <label className='auth-label' htmlFor='userId'>
                아이디
              </label>
              <input
                className='auth-input'
                type='text'
                id='userId'
                defaultValue={randomUser.testID}
                placeholder='아이디를 입력해주세요'
                {...register('userId', {
                  required: '아이디를 입력해주세요',
                })}
              />
              {errors.userId && (
                <span className='auth-span' role='alert'>
                  {errors.userId.message}
                </span>
              )}
              <label className='auth-label' htmlFor='password'>
                비밀번호
              </label>
              <input
                className='auth-input'
                type='password'
                id='password'
                defaultValue={randomUser.testPW}
                placeholder='비밀번호를 입력해주세요'
                {...register('password', {
                  required: '비밀번호를 입력하세요',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8자 이상이어야 합니다',
                  },
                  validate: (value) => {
                    const hasNumber = /\d/.test(value);
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasSpecialChar = /[!@#$%^&*]/.test(value);
                    return (
                      (hasNumber &&
                        hasUpperCase &&
                        hasLowerCase &&
                        hasSpecialChar) ||
                      '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다'
                    );
                  },
                })}
              />
              {errors.password && (
                <span className='auth-span' role='alert'>
                  {errors.password.message}
                </span>
              )}
              <button className='auth-btn' type='submit'>
                로그인
              </button>
            </form>
          </div>
          <div className='signup-link'>
            <span>
              <Link to='/termsofservice'>회원가입</Link>
            </span>
            <span>
              <Link to='/signup'> | 아이디 찾기</Link>
            </span>
            <span>
              <Link to='/signup'> | 패스워드 찾기</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
