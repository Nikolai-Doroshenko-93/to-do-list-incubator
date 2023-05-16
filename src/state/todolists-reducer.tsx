import {v1} from 'uuid';
import {todolistsApi, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "../utils/error-utils";

export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>;
export type ChangeEntityStatusType = ReturnType<typeof ChangeEntityStatusAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof SetTodolistsAC>
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}
export type TodolistsActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | ChangeEntityStatusType;

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionsType):Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state];
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle'
                }
            })
        }
        case 'SET-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}

export const RemoveTodolistAC = (todolistId: string) => {
    return { type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const AddTodolistAC = (todolist: TodolistType)=> {
    return { type: 'ADD-TODOLIST', todolist}  as const
}
export const ChangeTodolistTitleAC = (todolistId: string, title: string) => {
    return { type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const
}
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return { type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId} as const
}
export const SetTodolistsAC =  (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists: todolists} as const
}
export const ChangeEntityStatusAC = (todolistId: string, status: RequestStatusType)=> {
    return { type: 'SET-ENTITY-STATUS', todolistId, status} as const
}

export const FetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.getTodolists()
            .then( (res) => {
                dispatch(SetTodolistsAC(res.data))
                dispatch(setStatusAC('succeeded'))
            })
    }
}
export const AddTodoListTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.createTodolist(title)
            .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(AddTodolistAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(dispatch, res.data)
        }
        })
            .catch((e) => {
                handleServerNetworkAppError(dispatch, e)
            })
    }
}

export const RemoveTodoListTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        dispatch(ChangeEntityStatusAC(todolistId, 'loading'))
        todolistsApi.deleteTodolist(todolistId)
            .then((res)=> {
                if (res.data.resultCode === 0) {
                    dispatch(RemoveTodolistAC(todolistId))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch, res.data)
                    dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
                }
            })
            .catch((e) => {
                handleServerNetworkAppError(dispatch, e)
                dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
            })
    }
}
export const ChangeTodoListTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.updateTodolist(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(ChangeTodolistTitleAC(todolistId, title))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch, res.data)
                    dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
                }
            })
            .catch((e) => {
                handleServerNetworkAppError(dispatch, e)
                dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
            })
    }
}