import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterType} from "../App";
import addItemForm from "../AddItemForm/AddItemForm";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem, Typography} from "@material-ui/core";
import HighlightOffTwoToneIcon from '@material-ui/icons/HighlightOffTwoTone';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
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
    changeTaskStatus: (taskId: string, newIsDone: boolean, todoListId: string) => void
    removeTodoList: (todoListId: string)=> void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export function TodoList(props: PropsType) {


    const getTasksListItem = (t: TaskType) => {
        const removeTask = () => props.removeTask(t.id, props.todoListId)
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.todoListId)
        const changeTaskTitle = (title: string) => {
            props.changeTaskTitle(t.id, title, props.todoListId)
        }
        return (
            <ListItem
                style={{
                    padding: "0px",
                    justifyContent: "space-between",
                    textDecoration: t.isDone ? "line-through" : "none"
                }}
                key={t.id}>
                <Checkbox
                    color={"primary"}
                    size={"small"}
                    onChange={changeTaskStatus}
                    checked={t.isDone}
                />
                <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                <IconButton onClick={removeTask} size={"small"} color={"secondary"}>
                    <HighlightOffTwoToneIcon/>
                </IconButton>
            </ListItem>
        )
    }
    const tasksList = props.tasks.length
        ? <List style={{width: "290px"}}>{props.tasks.map(getTasksListItem)}</List>
        : <span> Your taskslist is empty :(</span>

    const addTask = (title: string) => {
        props.addTask(title, props.todoListId )
    }

    const handlerCreator = (filter: FilterType) => () => props.changeTodoListFilter(filter, props.todoListId)
    const removeTodoList = () => props.removeTodoList(props.todoListId)
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.todoListId)
    }
    return (
        <div>
            <Typography variant={"h5"}
                        align={"center"}
                        style={{fontWeight:"bold", margin: "20px"}}>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton size={"small"} onClick={removeTodoList} color={"secondary"}>
                    <DeleteForeverIcon/>
                </IconButton>
            </Typography>
            <AddItemForm
                addItem={addTask}
            />
                {tasksList}
            <div>
                <ButtonGroup
                    variant={"contained"}
                    size={"small"}
                    fullWidth
                    style={{width: "280px", margin: "10px"}}
                >
                    <Button
                        color={props.filter === "All" ? "secondary" : "primary"}
                        onClick={handlerCreator("All")}
                    >All
                    </Button>
                    <Button
                        color={props.filter === "Active" ? "secondary" : "primary"}
                        onClick={handlerCreator("Active")}
                    >Active
                    </Button>
                    <Button
                        color={props.filter === "Completed" ? "secondary" : "primary"}
                        onClick={handlerCreator("Completed")}
                    >Completed
                    </Button>
                </ButtonGroup>
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
