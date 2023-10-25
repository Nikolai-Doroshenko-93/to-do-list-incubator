import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {BaseResponseType} from "../../common/types/common.types";
import {thunkTryCatch} from "../../common/utils/thunk-try-catch";

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



export const login = createAppAsyncThunk<{isLoggedIn: boolean}, LoginParamsType, {rejectValue: BaseResponseType | null}>(
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
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError);
                return rejectWithValue(res.data);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch);
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
    return thunkTryCatch(thunkAPI, async ()=> {
    const res = await authAPI.me()
    if(res.data.resultCode == 0) {
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
        return { isLoggedIn: true };
    } else {
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
        return rejectWithValue(null)
            }
        })
    })
export const authReducer = slice.reducer;
export const authThunks = {login, logout, initializeApp}