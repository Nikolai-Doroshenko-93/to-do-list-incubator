import {TasksStateType} from '../app/AppWithRedux';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskType, todolistsApi, UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../app/store";
import {setErrorAC, setStatusAC} from "../app/app-reducer";

// export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}
// export type ChangeTaskTitleActionType = {
//
// }

export type SetTasksActionType = {
    type: 'SET-TASKS',
    tasks: Array<TaskType>,
    todolistId: string
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTask>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType) => {
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
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return { type: 'ADD-TASK', task} as const
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateTaskType) => {
   return {type: 'UPDATE_TASK', todolistId, taskId, model} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks: tasks, todolistId: todolistId}
}

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'))
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setStatusAC('succeeded'))
        })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setStatusAC('loading'))
    todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                dispatch(removeTaskAC(todolistId, taskId) )
                dispatch(setStatusAC('succeeded'))
    })
                .catch(() => {
                    alert('network error')
                })
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
                    if (res.data.messages.length) {
                        dispatch(setErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setErrorAC('some error occurred'))
                    }
                    dispatch(setStatusAC('failed'))
                }
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
                        if(res.data.messages.length) {
                            dispatch(setErrorAC(res.data.messages[0]))
                        } else {
                            dispatch(setErrorAC('some error occurred'))
                        }
                        dispatch(setStatusAC('failed'))
                    }
                })
        }
    }
}
