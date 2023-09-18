import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

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
    "auth/login",
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

export const logout = createAppAsyncThunk<{isLoggedIn: boolean}, undefined>(
    "auth/logout",
    async (arg, { dispatch, rejectWithValue }) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI.logout();
        try {
            if (res.data.resultCode === 0) {
                dispatch(clearTasksAndTodolists());
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

export const initializeApp = createAppAsyncThunk<{isLoggedIn: boolean}, undefined> (
    'auth/initializeApp', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI

        try {
            const res = await authAPI.me()
            if(res.data.resultCode == 0) {
                return { isLoggedIn: true };
            } else {
                return rejectWithValue(null)
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
export const authThunks = {login, logout, initializeApp}