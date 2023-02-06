import React, {Reducer, useCallback, useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    ActionsType, AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
// import {Reducer} from "redux";


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)

    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()




    const removeTask = useCallback((id: string, todolistId: string) => {
        //достанем нужный массив по todolistId:
        dispatch(removeTaskAC(id, todolistId))
    }, [dispatch]);
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskAC(title, todolistId))
    }, [dispatch]);

    const changeStatus = useCallback((id: string, isDone: boolean, todolistId: string) => {
        //достанем нужный массив по todolistId:
        dispatch(changeTaskStatusAC(id, todolistId, isDone))
    }, [dispatch]);

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        //достанем нужный массив по todolistId:
        dispatch(changeTaskTitleAC(id, newTitle, todolistId))
    }, [dispatch]);

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        dispatch(ChangeTodolistFilterAC(todolistId, value))
    }, [dispatch]);

    const removeTodolist = useCallback((id: string)=>  {
        let action = RemoveTodolistAC(id)
        dispatch(action)
    }, [dispatch]);

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(ChangeTodolistTitleAC(id, title))
    }, [dispatch]);

    const addTodolist = useCallback((title: string)=> {
        let action = AddTodolistAC(title)
        dispatch(action)
    }, [dispatch]);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
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
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
