import axios, {AxiosResponse} from "axios";
import {TodolistDomainType} from "../state/todolists-reducer";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "0ca925e4-9f59-4d59-ac63-6da41cf2f0df"
    }
}
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    ...settings
})

export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
type ResponseType<D = {}> = {
    resultCode: number,
    messages: string[],
    fieldsErrors: string[],
    data: D
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string,
    completed: boolean,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
    id: string,
    todoListId: string,
    order: number,
    addedDate: string
}
type GetTasksResponse = {
    error: string | null,
    totalCount: number,
    items: TaskType[]
}
export type UpdateTaskType = {
    title: string,
    description: string,
    status: number,
    priority: number,
    startDate: string,
    deadline: string,
    completed: boolean
}

export const todolistsApi = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        console.log(title)
        return instance.post<ResponseType<{item: TodolistType}>, AxiosResponse<ResponseType<{ item: TodolistType}>>, {title: string}>('todo-lists', {title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, {title: title})
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(title: string, todolistId: string) {
        return instance.post<ResponseType<{ item: TaskType}>, AxiosResponse<ResponseType<{ item: TaskType}>>, {title: string}>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}