import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        //@ts-ignore
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        //@ts-ignore
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    //@ts-ignore
    dispatch(setAppStatusAC({status:'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    //@ts-ignore
    dispatch(setAppErrorAC(error.message ? {error: error.message} : {error: 'Some error occurred'}))
    //@ts-ignore
    dispatch(setAppStatusAC({status: 'failed'}))
}
