import {setErrorAC, setStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from '../api/todolists-api'

export const handleServerNetworkAppError = (dispatch: Dispatch, error: { message: string}) => {
    dispatch(setStatusAC('failed'))
    dispatch(setErrorAC(error.message))
}



export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
 {
        if (data.messages.length) {
            dispatch(setErrorAC(data.messages[0]))
        } else {
            dispatch(setErrorAC('some error occurred'))
        }
        dispatch(setStatusAC('failed'))
    }
}