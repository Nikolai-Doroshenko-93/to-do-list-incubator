import {TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;


type ActionsType = RemoveTaskActionType
                    | AddTaskActionType
                    | ChangeTaskStatusActionType
                    | ChangeTaskTitleActionType
                    | AddTodolistActionType
                    | RemoveTodolistActionType;

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
            let task = {
                description: "",
                title: action.title,
                completed: false,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: v1(),
                order: 0,
                addedDate: ""
            }
            return {
                ...state, [action.todolistId]: [task, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':

            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id == action.taskId
                        ? {...t, completed: action.completed}
                        : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id == action.taskId
                        ? {...t, title: action.title}
                        : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }
        case 'REMOVE-TODOLIST':
            {
                let copyState = {...state}
                delete copyState[action.id]
                // const {[action.id]:[], ...rest} = {...state}
                // return rest
                return copyState
            }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return { type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (title: string, todolistId: string) => {
    return { type: 'ADD-TASK', title, todolistId} as const
}
export const changeTaskStatusAC = (todolistId: string, taskId: string, completed: boolean) => {
   return {type: 'CHANGE-TASK-STATUS', todolistId, taskId, completed} as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, title} as const
}

