export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    isInitialized: boolean,
    status: RequestStatusType,
    error: string | null
}

const initialState: InitialStateType = {
    isInitialized: false,
    status: 'idle',
    error: null
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const setErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setIsInitializedAC = (value: boolean) =>
    ({type: 'APP/SET-IS-INITIALIZED', value} as const)

export type SetErrorActionType = ReturnType<typeof setErrorAC>
export type SetStatusActionType = ReturnType<typeof setStatusAC>;
type ActionsType =
    | SetErrorActionType
    | SetStatusActionType
    | ReturnType<typeof setIsInitializedAC>