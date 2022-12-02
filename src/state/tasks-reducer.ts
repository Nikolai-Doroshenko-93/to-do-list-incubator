import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>


type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        }

        case 'ADD_TASK': {
            let task = {id: v1(), title: action.title, isDone: false};
            return {
                ...state,
                [action.todolistId]: [task, ...state[action.todolistId]]
            }
        }
        case 'CHANGE_TASK_STATUS': {
            return {
               ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(task => task.id=== action.taskId ? {...task, isDone: action.isDone}: task)
            }
        }
        case 'CHANGE_TASK_TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(task => task.id=== action.taskId ? {...task, title: action.title}: task)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        default:
            throw new Error("I don't understand this type")
    }
}


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return { type: 'REMOVE_TASK', taskId, todolistId} as const
}
export const addTaskAC = (todolistId: string, title: string)  => {
    return { type: 'ADD_TASK', todolistId, title} as const
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return { type: 'CHANGE_TASK_STATUS', taskId, isDone, todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return { type: 'CHANGE_TASK_TITLE', taskId, title, todolistId} as const
}
