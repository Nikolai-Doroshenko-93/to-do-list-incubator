import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "837231db-6036-455b-8898-180b09b688b9"
    }
}



export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist("blabla")
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '287baf77-6be0-4ec3-b66b-d7b9531b898a'
        todolistsApi.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '911b5be9-f52d-42c7-ba12-90d55466d8f2'
        todolistsApi.updateTodolist(todolistId, 'parapam')
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    let todolistId = 'e0ffd38c-1754-4205-90e7-173a42ea040c'
    useEffect(() => {
        todolistsApi.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    let todolistId = 'e0ffd38c-1754-4205-90e7-173a42ea040c'
    let title = 'youoyou'
    useEffect(() => {
        todolistsApi.createTask(title, todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    let todolistId = 'e0ffd38c-1754-4205-90e7-173a42ea040c'
    let taskId = '4256fc81-2ee3-4aa0-b7c4-58f069024f0b'
    useEffect(() => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

// export const UpdateTask = () => {
//     const [state, setState] = useState<any>(null)
//     let todolistId = 'e0ffd38c-1754-4205-90e7-173a42ea040c'
//     let taskId = '4256fc81-2ee3-4aa0-b7c4-58f069024f0b'
//
//     useEffect(() => {
//         todolistsApi.deleteTask(todolistId, taskId)
//             .then((res) => {
//                 setState(res.data)
//             })
//     }, [])
//     return <div>{JSON.stringify(state)}</div>
// }