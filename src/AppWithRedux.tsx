import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC, FetchTodolistsTC,
    RemoveTodolistAC, TodolistDomainType,
} from "./state/todolists-reducer";
import {
    addTaskAC, addTasksTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    removeTaskTC,
    tasksReducer, updateTasksTC
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType, useAppDispatchWithType} from "./state/store";
import {TaskStatuses, TaskType, todolistsApi} from "./api/todolists-api";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed";

function AppWithRedux() {

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
    }, [dispatch]);

    const changeStatus = useCallback((todolistId: string,id: string,  status: TaskStatuses) => {
        //достанем нужный массив по todolistId:
        dispatch(updateTasksTC(todolistId, id, status))
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

export default AppWithRedux;
