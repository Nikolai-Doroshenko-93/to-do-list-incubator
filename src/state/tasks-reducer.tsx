import {TasksStateType} from '../app/AppWithRedux';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskType, todolistsApi, UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunkType} from "../app/store";
import {setStatusAC} from "../app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "../utils/error-utils";
import {AxiosError} from "axios";


export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTask>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType) => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [
                    action.task,
                    ...state[action.task.todoListId]
                ]
            }
        case 'UPDATE_TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(m =>
                        m.id === action.taskId
                        ? {...m, ...action.model}
                        : m)
            }
            }

        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'REMOVE-TODOLIST':
            {
                let copyState = {...state}
                delete copyState[action.id]
                // const {[action.id]:[], ...rest} = {...state}
                // return rest
                return copyState
            }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            return {
                ...state,
                [action.todolistId]: [...action.tasks, ...state[action.todolistId]]
            }
        }

        default:
            return state
    }
}
export const removeTaskAC = (todolistId: string, taskId: string) => {
    return { type: 'REMOVE-TASK', todolistId, taskId} as const
}
export const addTaskAC = (task: TaskType) => {
    return { type: 'ADD-TASK', task} as const
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateTaskType) => {
   return {type: 'UPDATE_TASK', todolistId, taskId, model} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks: tasks, todolistId: todolistId} as const
}

export const getTasksTC = (todolistId: string) : AppThunkType => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setStatusAC('succeeded'))
        })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) : AppThunkType => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setStatusAC('succeeded'))
            })
            .catch(() => {
                alert('network error')
            })
    }
}

export const addTasksTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
        todolistsApi.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    handleServerAppError(dispatch, res.data)
                }
            })
            .catch((e: AxiosError<{messages: string[]}>) => {
                const error = e.response?.data ? e.response.data.messages : e.message
                handleServerNetworkAppError(dispatch, e)
            })
    }
}

export type UpdateDomainTaskModelType = {
    title?: string,
    description?: string,
    status?: number,
    priority?: number,
    startDate?: string,
    deadline?: string,
    completed?: boolean
}

export const updateTasksTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            const apiModel: UpdateTaskType = {
                title: task.title,
                description: task.description,
                completed: task.completed,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                status: task.status,
                ...domainModel
            }
            dispatch(setStatusAC('loading'))
            todolistsApi.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTask(todolistId, taskId, apiModel))
                    } else {
                        handleServerAppError(dispatch, res.data)
                    }
                })
                .catch((e) => {
                    handleServerNetworkAppError(dispatch, e)
                })
        }
    }
}
