import {TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi} from "../api/todolists-api";
import {Dispatch} from "redux";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type SetTasksActionType = {
    type: 'SET-TASKS',
    tasks: Array<TaskType>,
    todolistId: string
}

type ActionsType = RemoveTaskActionType
                    | AddTaskActionType
                    | ChangeTaskStatusActionType
                    | ChangeTaskTitleActionType
                    | AddTodolistActionType
                    | RemoveTodolistActionType
                    | SetTodolistsActionType
                    | SetTasksActionType;

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
                    .map(t => t.id === action.taskId
                        ? {...t, completed: action.completed}
                        : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId
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
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
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

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks: tasks, todolistId: todolistId}
}

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
    }
}
export const removeTaskTC = (taskId: string, todolistId: string) => {

    return (dispatch: Dispatch) => {
        todolistsApi.deleteTask(taskId, todolistId)
            .then(res => {
                let action = removeTaskAC(taskId, todolistId)
                dispatch(action)
            })
    }
}
