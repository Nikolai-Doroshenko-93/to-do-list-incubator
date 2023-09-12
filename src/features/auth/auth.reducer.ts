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
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(login.fulfilled, (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
      })
      builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        })
        builder.addCase(initializeApp.fulfilled, (state, action) => {
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

export const logout = createAppAsyncThunk<{isLoggedIn:boolean}, undefined>(
    "todolists/logout",
    async (arg, { dispatch, rejectWithValue }) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI.logout();
        try {
            if (res.data.resultCode === 0) {
                dispatch(clearTasksAndTodolists({tasks: {}, todolists: []}));
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {isLoggedIn: false}
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
);

export const initializeApp = createAppAsyncThunk<any, undefined> (
    'auth/initializeApp', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI

        try {
            const res = await authAPI.me()
            if(res.data.resultCode == 0) {
                return { isLoggedIn: true };
            } else {
            }}
        catch(e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
        finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));

        }
    }
)
export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {login, logout,  initializeApp}