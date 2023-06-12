import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC (state, action: PayloadAction<{value: boolean}>){
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
// actions


// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    //@ts-ignore
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                //@ts-ignore
                dispatch(setIsLoggedInAC({value: true}))
                //@ts-ignore
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                //@ts-ignore
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            //@ts-ignore
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    //@ts-ignore
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                //@ts-ignore
                dispatch(setIsLoggedInAC({value: false}))
                //@ts-ignore
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                //@ts-ignore
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            //@ts-ignore
            handleServerNetworkError(error, dispatch)
        })
}

// types

