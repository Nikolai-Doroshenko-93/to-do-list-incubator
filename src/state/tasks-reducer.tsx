import {TasksStateType} from '../AppWithRedux';
import {v1} from 'uuid';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}
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
            return {
                ...state,
                [action.task.todoListId]: [
                    action.task,
                    ...state[action.task.todoListId]
                ]
            }
        case 'CHANGE-TASK-STATUS': {
                let todolistTasks = state[action.todolistId];
                let newTasksArray = todolistTasks
                    .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

                state[action.todolistId] = newTasksArray;
                return ({...state})
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
export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => {
   return {type: 'CHANGE-TASK-STATUS', todolistId, taskId, status} as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, title} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks: tasks, todolistId: todolistId}
}

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
    todolistsApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                dispatch(removeTaskAC(todolistId, taskId) )
    })
                .catch(() => {
                    alert('network error')
                })
    }

export const addTasksTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsApi.createTask(todolistId, title)
            .then((res) => {
//@ts-ignore
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}
export const updateTasksTC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        const task = getState().tasks[todolistId].find(t => t.id === taskId)
        if (task) {
            const model: UpdateTaskType = {
                title: task.title,
                description: task.description,
                completed: task.completed,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                status
            }

            todolistsApi.updateTask(todolistId, taskId, model)
                .then((res) => {
                    changeTaskStatusAC(todolistId, taskId, status)
                    alert('update task')
                })
        }
    }
}
