import axios from "axios";


const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "837231db-6036-455b-8898-180b09b688b9"
    }
}
const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    ...settings
})

export type TodolistType = {
    id: string,
    title: string,
    addedData: string,
    order: number
}
type ResponseType<D = {}> = {
    resultCode: number,
    message: string[],
    fieldsErrors: string[],
    data: D
}
type TaskType = {
    description: string
    title: string,
    completed: boolean,
    status: number,
    priority: number,
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
type UpdateTaskType = {
    title: string,
    description: string,
    status: number,
    priority: number,
    startDate: string,
    deadline: string
}

export const todolistsApi = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title: title})
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title: title})
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(title: string, todolistId: string) {
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}