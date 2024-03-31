import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from '@reduxjs/toolkit';
import signupApi from '../../api/signUp';

interface User {
  userId: string;
  email: string;
  password: string;
}

interface SignUpState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: SignUpState = {
  user: null,
  loading: false,
  error: null,
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    signUpError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

type ErrorWithMessage = {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

class ReadError extends Error {
  constructor(message: string, public originalError: unknown) {
    super(message);
    this.name = 'ReadError';
  }
}

export const signUpUser = (userdata: User) => async (dispatch: Dispatch) => {
  try {
    dispatch(signUpStart()); 
    const user = await signupApi(userdata); 
    dispatch(signUpSuccess(user));
  } catch (error) {
    if (isErrorWithMessage(error)) {
      dispatch(signUpError(error.message)); 
      throw new ReadError("Validation Error", error); 
    } else {
      throw error;
    }
  }
};

export const { signUpStart, signUpSuccess, signUpError } = signUpSlice.actions;

export default signUpSlice.reducer;
