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
    const [todolistId, setTodolistId] = useState<string>("")


   const GetTasks = () => {
       todolistsApi.getTasks(todolistId)
           .then((res) => {
               setState(res.data)
           })
   }
    return <div>{JSON.stringify(state)}
        <input placeholder={"TodolistId"}
               value={todolistId}
               onChange={(e) => {setTodolistId(e.currentTarget.value)}}
        />
        <button onClick={GetTasks}>get tasks</button>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [title, setTitle] = useState<string>("")


    const CreateTask = () => {
        todolistsApi.createTask(title, todolistId)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <input placeholder={"Title"}
               value={title}
               onChange={(e) => {setTitle(e.currentTarget.value)}}
        />
        <input placeholder={"TodolistId"}
               value={todolistId}
               onChange={(e) => {setTodolistId(e.currentTarget.value)}}
        />
        <button onClick={CreateTask}>create task</button>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>("")
    const [todolistId, setTodolistId] = useState<string>("")

    const DeleteTask = () => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={"TodolistId"}
                   value={todolistId}
                   onChange={(e) => {setTodolistId(e.currentTarget.value)}}
            />
            <input placeholder={"TaskId"}
                   value={taskId}
                   onChange={(e) => {setTaskId(e.currentTarget.value)}}
            />
            <button onClick={DeleteTask}>delete task</button>
        </div>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('title 1')
    const [description, setDescription] = useState<string>('description 1')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')

    const [taskId, setTaskId] = useState<string>("")
    const [todolistId, setTodolistId] = useState<string>("")

    const UpdateTask = () => {
        //@ts-ignore
        todolistsApi.updateTask(todolistId, taskId, {
            deadline: "",
            description: description,
            startDate: "",
            priority: priority,
            status: status,
            title: title
        }
            )
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <input placeholder={"TodolistId"}
               value={todolistId}
               onChange={(e) => {setTodolistId(e.currentTarget.value)}}
        />
        <input placeholder={"TaskId"}
               value={taskId}
               onChange={(e) => {setTaskId(e.currentTarget.value)}}
        />
        <input placeholder={"title"}
               value={title}
               onChange={(e) => {setTitle(e.currentTarget.value)}}
        />
        <input placeholder={"description"}
               value={description}
               onChange={(e) => {setDescription(e.currentTarget.value)}}
        />
        <input placeholder={"status"}
               value={status}
               onChange={(e) => {setStatus(+e.currentTarget.value)}}
        />
        <input placeholder={"priority"}
               value={priority}
               onChange={(e) => {setPriority(+e.currentTarget.value)}}
        />
        <input placeholder={"startDate"}
               value={startDate}
               onChange={(e) => {setStartDate(e.currentTarget.value)}}
        />
        <input placeholder={"deadline"}
               value={deadline}
               onChange={(e) => {setDeadline(e.currentTarget.value)}}
        />
        <button onClick={UpdateTask}>update task</button>
    </div>
}