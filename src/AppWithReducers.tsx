import React, {useReducer, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    ActionsType, AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC, FilterValuesType,
    RemoveTodolistAC, TodolistDomainType,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "./api/todolists-api";
import {Reducer} from "redux";




function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, dispatchTodolists] = useReducer<Reducer<Array<TodolistDomainType>, ActionsType>>(todolistsReducer,[
        {id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: ""},
        {id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: ""}
    ])
//@ts-ignore
    let [tasks, dispatchTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {
                description: "",
                title: "Css",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: todolistId1,
                order: 0,
                addedDate: ""
            },
            {
                description: "",
                title: "React",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: todolistId1,
                order: 0,
                addedDate: ""
            }
        ],
        [todolistId2]: [
            {
                description: "",
                title: "Milk",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: todolistId2,
                order: 0,
                addedDate: ""
            },
            {
                description: "",
                title: "Beer",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: todolistId2,
                order: 0,
                addedDate: ""
            }
        ]
    });


    function removeTask(id: string, todolistId: string) {
        //достанем нужный массив по todolistId:
        //@ts-ignore
        dispatchTasks(removeTaskAC(id, todolistId))
    }
    function addTask(title: string, todolistId: string) {
        //@ts-ignore
        dispatchTasks(addTaskAC(title, todolistId))
    }

    function changeStatus(id: string,  todolistId: string, isDone: boolean) {
        //достанем нужный массив по todolistId:
        //@ts-ignore
        dispatchTasks(changeTaskStatusAC(id, todolistId, isDone))
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        //достанем нужный массив по todolistId:
        //@ts-ignore
        dispatchTasks(changeTaskTitleAC(id, newTitle, todolistId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatchTodolists(ChangeTodolistFilterAC(todolistId, value))
    }

    function removeTodolist(id: string) {
        let action = RemoveTodolistAC(id)
        dispatchTodolists(action)
        //@ts-ignore
        dispatchTasks(action)
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatchTodolists(ChangeTodolistTitleAC(id, title))
    }

    function addTodolist(title: string) {
        let action = AddTodolistAC(title)
        dispatchTodolists(action)
        //@ts-ignore
        dispatchTasks(action)
    }

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
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                //@ts-ignore
                                tasksForTodolist = allTodolistTasks.filter(t => t.completed === false);
                            }
                            if (tl.filter === "completed") {
                                //@ts-ignore
                                tasksForTodolist = allTodolistTasks.filter(t => t.completed === true);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
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
