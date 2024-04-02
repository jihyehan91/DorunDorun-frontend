import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import {userIdCheckApi } from '../api/userCheck';
import { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { signUpUser } from '../store/features/signUpSlice';

import '../assets/css/auth.css';

type FormData = {
  username: string;
  userId: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const dispatch = useAppDispatch();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [userIdCheck, setUserIdCheck] = useState<boolean | null>(null);
  const [userIdRedundancy, setUserIdRedundancy] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (userdata) => {
    const requestData = {
      userId: userdata.userId,
      email: userdata.email,
      password: userdata.password,
    };

    console.log('onSubmit', userdata);
    dispatch(signUpUser(requestData));
  }

  const onError: SubmitErrorHandler<FormData> = (errors) => {
    console.log('onError', errors);
  };

  // 아이디 중복 체크
  const checkUserId = async () => {
    const userId = watch('userId');
    if (!userId) {
      setUserIdRedundancy(null);
      return;
    }
    try {
      const response = await userIdCheckApi(userId);
      setUserIdRedundancy(response);
      if(response === true){
        alert('중복된 아이디 입니다.')
      }else{
        alert('사용 가능한 아이디 입니다.')
      }
    } catch (error) {
      console.log('오류 발생:', error);
    }
  };

  const userIdValid = userIdCheck === '' && watch('userId').length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(watch('userId'));

  //아이디 실시간 체크
  useEffect(() => {
    const timer = setTimeout(() => {
      const userId = watch('userId');
      let errorMessage = '';
      if (userId !== '') {
        if (userId.length < 6) {
          errorMessage = '아이디는 6자 이상이어야 합니다';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(userId)) {
          errorMessage = '아이디는 영문과 숫자의 조합으로 이루어져야 합니다';
        }
      }
      setUserIdCheck(errorMessage);
    }, 100);

    return () => clearTimeout(timer);
  }, [watch('userId')]);

  //비벌번호 실시간 체크
  useEffect(() => {
    const timer = setTimeout(() => {
      const password = watch('password');
      let errorMessage = '';
      if (password !== '') {
        if (password.length < 8) {
          errorMessage = '비밀번호는 8자 이상 및 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다';
        } else if (!/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
          errorMessage = '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다';
        }
      }
      setPasswordError(errorMessage);
    }, 100);

    return () => clearTimeout(timer);
  }, [watch('password')]);

  // 비빌번호 확인 실시간 체크
  useEffect(() => {
    const timer = setTimeout(() => {
      const confirmPassword = watch('confirmPassword');
      const password = watch('password');
      let errorMessage = '';
      if (confirmPassword !== '' && password !== '') {
        if (confirmPassword !== password) {
          errorMessage = '비밀번호가 일치하지 않습니다';
        }
      }
      setConfirmPasswordError(errorMessage);
    }, 100);

    return () => clearTimeout(timer);
  }, [watch('confirmPassword'), watch('password')]);

  return (
    <div className='form-container'>
      <div className='form-area signup'>
        <div className='form-elements'>
          <div className='form-title signup'>
            <Link to='/'>
              <h1 className='logo'>DoRun-DoRun</h1>
            </Link>
          </div>
          <div className='form-box'>
            <form
              className='auth-form'
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <label className='auth-label' htmlFor='username'>
                이름
              </label>
              <input
                className='auth-input'
                type='text'
                id='username'
                placeholder='이름을 입력해주세요'
                {...register('username', {
                  required: '이름을 입력해주세요',
                  minLength: {
                    message: '이름은 최소 2글자 이상 작성해주세요',
                    value: 2,
                  },
                })}
              />
              {errors.username && (
                <span className='auth-span' role='alert'>
                  {errors.username.message}
                </span>
              )}

              <label className='auth-label' htmlFor='userId'>
                아이디
              </label>
              <div className='flex'>
              <input
                className='auth-input mr-2 w-3/4'
                type='text'
                id='userId'
                placeholder='8글자 이상, 영문 및 숫자 조합'
                {...register('userId', {
                  required: '아이디를 입력해주세요',
                  minLength: {
                    value: 6,
                    message: '아이디는 6자 이상이어야 합니다',
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message: '아이디는 영문과 숫자의 조합으로 이루어져야 합니다',
                  },
                })}
              />
              <button
                className={`py-0.5 rounded border-0 text-white font-medium text-sm whitespace-nowrap ${!userIdValid ? 'bg-gray-400' : 'bg-[var(--btn-bg)]'}`}
                type='button'
                onClick={checkUserId}
                disabled={!userIdValid}>아이디 중복 검사</button>

              </div>
              {errors.userId && (
                <span className='auth-span' role='alert'>
                  {errors.userId.message}
                </span>
              )}
                 {userIdCheck && <span className='auth-span' role='alert'>{userIdCheck}</span>}
              {userIdRedundancy !== null && (
                <span className={!userIdRedundancy ? 'text-blue-500 text-xs' : 'text-red-500 text-xs'}>
                  {!userIdRedundancy ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'}
                </span>
              )}

              <label className='auth-label' htmlFor='email'>
                이메일
              </label>
              <input
                className='auth-input'
                type='email'
                id='email'
                placeholder='이메일 주소를 입력해주세요'
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: '유효한 이메일 주소를 입력하세요',
                  },
                })}
              />
              {errors.email && (
                <span className='auth-span' role='alert'>
                  {errors.email.message}
                </span>
              )}

              <label className='auth-label' htmlFor='password'>
                비밀번호
              </label>
              <input
                className='auth-input'
                type='password'
                id='password'
                placeholder='영문, 숫자, 대문자, 특수문자 포함 8자리 이상'
                {...register('password', {
                  required: '비밀번호를 입력하세요',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 8자 이상이어야 합니다',
                  },
                  validate: (value) => {
                    const pwNumber = /\d/.test(value);
                    const pwUpperCase = /[A-Z]/.test(value);
                    const pwLowerCase = /[a-z]/.test(value);
                    const pwSpecialChar = /[!@#$%^&*]/.test(value);
                    return (
                      (pwNumber &&
                        pwUpperCase &&
                        pwLowerCase &&
                        pwSpecialChar) ||
                      '비밀번호는 숫자, 대문자, 소문자, 특수문자를 포함해야 합니다'
                    );
                  },
                })}
              />
              {passwordError && <span className='auth-span' role='alert'>{passwordError}</span>}
              {errors.password && (
                <span className='auth-span' role='alert'>
                  {errors.password.message}
                </span>
              )}

              <label className='auth-label' htmlFor='confirmPassword'>
                비밀번호 확인
              </label>
              <input
                className='auth-input mb-5'
                type='password'
                id='confirmPassword'
                placeholder='비밀번호와 동일하게 입력해주세요'
                {...register('confirmPassword', {
                  required: '비밀번호를 한번 더 입력해주세요',
                  validate: (value) =>
                    value === watch('password') ||
                    '비밀번호가 일치하지 않습니다',
                })}
              />
              {confirmPasswordError && <span className='auth-span' role='alert'>{confirmPasswordError}</span>}
              {errors.confirmPassword && (
                <span className='auth-span' role='alert'>
                  {errors.confirmPassword.message}
                </span>
              )}
              <button
                className={userIdRedundancy === true || userIdRedundancy === null ? 'auth-btn bg-neutral-400' : 'auth-btn'}
                type='submit'
                disabled={userIdRedundancy === true || userIdRedundancy === null}
              >가입하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
