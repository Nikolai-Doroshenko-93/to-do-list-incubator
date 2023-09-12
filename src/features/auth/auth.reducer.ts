import {authAPI, LoginParamsType, todolistsAPI} from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { tasksActions, tasksReducer } from "../TodolistsList/tasks.reducer";
import { todolistsActions } from "../TodolistsList/todolists.reducer";
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
    extraReducers: (builder) => {
      builder.addCase(login.fulfilled, (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
      })
    }
});



export const login = createAppAsyncThunk<{isLoggedIn: boolean}, LoginParamsType>(
    "todolists/login",
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }));
            const res = await authAPI.login(arg);
            if(res.data.resultCode == 0) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {isLoggedIn: true};
            } else {
                handleServerNetworkError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
);

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

export const logout = createAppAsyncThunk<any, any>(
    "todolists/logout",
    async (arg, { dispatch, rejectWithValue }) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI.logout();
        try {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: false}));
                dispatch(clearTasksAndTodolists({tasks: {}, todolists: []}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
);
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {login}