import {v1} from 'uuid';
import {TaskType, todolistsApi, TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setErrorAC, setStatusAC} from "../app/app-reducer";
import {AppRootStateType} from "../app/store";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>;
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeEntityStatusType = ReturnType<typeof ChangeEntityStatusAC>

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS',
    todolists: Array<TodolistType>
}

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

export type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | ChangeEntityStatusType;


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: ActionsType):Array<TodolistDomainType> => {
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

export const RemoveTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
export const AddTodolistAC = (todolist: TodolistType)=> {
    return { type: 'ADD-TODOLIST', todolist} as const
}
export const ChangeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId}
}
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId}
}
export const SetTodolistsAC =  (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists: todolists}
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
                dispatch(AddTodolistAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
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
                    if (res.data.messages.length) {
                        dispatch(setErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setErrorAC('some error occurred'))
                    }
                    dispatch(setStatusAC('failed'))
                    dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
                }
            })
            .catch((e) => {
                dispatch(ChangeEntityStatusAC(todolistId, 'failed'))
                dispatch(setStatusAC('failed'))
                dispatch(setErrorAC(e.message))
            })
    }
}
export const ChangeTodoListTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(ChangeTodolistTitleAC(todolistId, title))
                dispatch(setStatusAC('succeeded'))
            })
    }
}