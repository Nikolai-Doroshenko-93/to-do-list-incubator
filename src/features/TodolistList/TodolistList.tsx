import React, {useCallback, useEffect} from 'react';
import {Todolist} from './Todolist/Todolist';
import {AddItemForm} from '../../component/AddItemForn/AddItemForm';
import Paper from "@mui/material/Paper";
import {
    AddTodoListTC, ChangeTodolistFilterAC,
    ChangeTodoListTitleTC, FetchTodolistsTC,
    RemoveTodoListTC, TodolistDomainType,
} from "../../state/todolists-reducer";
import {
    addTasksTC,
    removeTaskTC,
    updateTasksTC
} from "../../state/tasks-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatchWithType} from "../../app/store";
import {TaskStatuses, TaskType} from "../../api/todolists-api";
import Grid from "@mui/material/Grid";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed";

function TodolistsList() {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useAppDispatchWithType()

    useEffect(() => {
        dispatch(FetchTodolistsTC())
    }, [])

    const removeTask = useCallback((todolistId: string, id: string) => {
        const thunk = removeTaskTC(todolistId, id)
        dispatch(thunk)
    }, []);

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(addTasksTC(todolistId, title))
    }, []);

    const changeStatus = useCallback((todolistId: string,id: string,  status: TaskStatuses) => {
        //достанем нужный массив по todolistId:
        dispatch(updateTasksTC(todolistId, id, {status}))
    }, []);

    const changeTaskTitle = useCallback((todolistId: string, id: string, title: string) => {
        //достанем нужный массив по todolistId:
        dispatch(updateTasksTC(todolistId, id, {title}))
    }, []);

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(ChangeTodolistFilterAC(todolistId, value))
    }, []);

    const removeTodolist = useCallback((id: string)=>  {
        dispatch(RemoveTodoListTC(id))
    }, []);

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(ChangeTodoListTitleTC(id, title))
    }, []);

    const addTodolist = useCallback((title: string)=> {
        dispatch(AddTodoListTC(title))
    }, []);

    return (
<>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasks[tl.id]}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        entityStatus={tl.entityStatus}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
        </>
    );
}

export default TodolistsList;
