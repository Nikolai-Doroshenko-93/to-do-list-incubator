import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterType} from "./App";
// import s from './Todolist.module.css'

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todoListId: string
    filter: FilterType
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string)=>void
    changeTodoListFilter: (filterVal: FilterType, todoListId: string)=>void
    addTask: (title: string, todoListId: string) => void
    changeTaskStatus: (id: string, newIsDone: boolean, todoListId: string) => void
    removeTodoList: (todoListId: string)=> void
}

export function TodoList(props: PropsType) {
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [error, setError] = useState<boolean>(false)

    const getTasksListItem = (t: TaskType) => {
        const removeTask = () => props.removeTask(t.id, props.todoListId)
        const changeTaskStatus = () => (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.todoListId)
        return (
            <li key={t.id}>
                <input
                    onChange={changeTaskStatus}
                    type={"checkbox"}
                    checked={t.isDone}
                />
                <span>{t.title}</span>
                <button onClick={removeTask}>x</button>
            </li>
        )
    }
    const tasksList = props.tasks.length
        ? <ul>{props.tasks.map(getTasksListItem)}</ul>
        : <span> Your taskslist is empty :(</span>

    const addTaskHandler = () => {
        const trimmedTitle = newTaskTitle.trim()
        if (trimmedTitle !== "") {
            props.addTask(trimmedTitle, props.todoListId)
        } else {
            setError(true)
        }
        setNewTaskTitle("")
    }

    const handlerCreator = (filter: FilterType) => () => props.changeTodoListFilter(filter, props.todoListId)

    const onEnterDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addTaskHandler();
    const onChangeSetLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setNewTaskTitle(e.currentTarget.value)
    }
    const removeTodoList = () => props.removeTodoList(props.todoListId)
    const errorMessage = error ? <div>Title is required</div> : null

    return (
        <div>
            <h3>
                {props.title}
                <button
                    onClick={removeTodoList}
                >x</button>
            </h3>
            <div>
                <input
                    value={newTaskTitle}
                    onChange={onChangeSetLocalTitle}
                    onKeyDown={onEnterDownAddTask}
                />
                <button onClick={addTaskHandler}>+</button>
                {errorMessage}
            </div>
            {tasksList}
            <div>
                <button
                    onClick={handlerCreator("All")}
                >All
                </button>
                <button
                    onClick={handlerCreator("Active")}
                >Active
                </button>
                <button
                    onClick={handlerCreator("Completed")}
                >Completed
                </button>
            </div>
        </div>
    )
}











//     const onChangeNewTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
//             setNewTaskTitle(e.currentTarget.value);
//     }
//     const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
//         if (e.ctrlKey && e.charCode === 13) {
//             props.addTask(newTaskTitle, props.todoListId)
//             setNewTaskTitle("")
//         }
//     }
//
//     const addTask = () => {
//         if(newTaskTitle.trim()!=='') {
//             props.addTask(newTaskTitle.trim(), props.todoListId)
//             setNewTaskTitle("")
//
//         } else {
//             setError("Title is required")
//         }
//     }
//     const onAllClickHandler = () => {props.changeTodoListFilter("All", props.todoListId)}
//     const onActiveClickHandler = () => {props.changeTodoListFilter("Active", props.todoListId)}
//     const onCompletedClickHandler = () => {props.changeTodoListFilter("Completed", props.todoListId)}
//
//
//
//     return <div>
//         <h3>{props.title}</h3>
//         <div>
//             <input  value = {newTaskTitle}
//                     onChange = {onChangeNewTitleHandler}
//                     onKeyPress = {onKeyPressHandler}
//                     className={error ? s.errorMessage : ""}
//             />
//             <button onClick={addTask}>+</button>
//         </div>
//         <div>{error}</div>
//         <ul>
//             {
//                 props.tasks.map((el) => {
//                     const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) => {
//                         props.changeTaskStatus(el.id, event.currentTarget.checked, props.todoListId)
//                     }
//                     const onRemoveHandler = () => {props.removeTask(el.id, props.todoListId)}
//                     return (
//                 <li key={el.id}>
//                     <button onClick={onRemoveHandler}>X</button>
//                     <input type="checkbox" defaultChecked={el.isDone} onChange={changeTaskStatus}/>
//                     <span>{el.title}</span>
//                 </li>
//                 )
//             })}
//         </ul>
//         <div>
//             <button onClick={onAllClickHandler}>All</button>
//             <button onClick={onActiveClickHandler}>Active</button>
//             <button onClick={onCompletedClickHandler}>Completed</button>
//         </div>
//     </div>
// }
