import { Dispatch } from 'redux'
import { SetErrorActionType, setStatusAC, SetStatusActionType } from '../app/app-reducer'
import {authApi, LoginType} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkAppError} from "../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    try {
        const response = await authApi.login(data)
        if(response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setStatusAC('succeeded'))
        } else {
            handleServerAppError(dispatch, response.data)
        }
    }
    catch(e) {
        handleServerNetworkAppError(dispatch, (e as any).message)
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetStatusActionType | SetErrorActionType