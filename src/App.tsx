import React, {useState} from 'react';
import { v1 } from 'uuid';
import './App.css';
import {TodoList} from './TodoList/TodoList';
import {TaskType} from "./TodoList/TodoList";
import AddItemForm from "./AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type FilterType  = "All" | "Active"| "Completed"

export type TodoListType = {
    id: string,
    title: string,
    filter: FilterType
}
type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}



function App() {

    // const [filterValue, setFilterValue] = useState("All")
    //
    const todoListId_1 = v1()
    const todoListId_2 = v1()


    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListId_1, title: "What to learn today", filter: "All"},
        {id: todoListId_2, title: "What to buy", filter: "All"}
    ])

    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListId_1]: [
            { id: v1(), title: "HTML&CSS", isDone: true },
            { id: v1(), title: "JS", isDone: true },
            { id: v1(), title: "ReactJS", isDone: false },
    ],
        [todoListId_2]: [
            { id: v1(), title: "Beer", isDone: true },
            { id: v1(), title: "Meat", isDone: true },
            { id: v1(), title: "Fish", isDone: false }
        ]
    }
)
    const changeTodoListFilter = (filterVal: FilterType, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, filter: filterVal} : tl))
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
    }
    const addTodoList = (title: string) => {
        const newTodoListId = v1()
        const newTodoList: TodoListType = {
            id: newTodoListId,
            title: title,
            filter: "All"
        }
        const nextState = [...todoLists, newTodoList]
        setTodoLists(nextState)
        setTasks({...tasks, [newTodoListId]: []})
    }
    const removeTodoList = (todoListId: string) => {
        const  nextState = todoLists.filter(tl => tl.id !== todoListId)
        setTodoLists(nextState)
        delete tasks[todoListId]
    }

    const removeTask = (taskId: string, todoListId: string) => {
        setTasks({...tasks,
            [todoListId]:tasks[todoListId].filter(t=> t.id !== taskId)
        })
    }
    const addTask = (newTaskTitle: string, todoListId: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: newTaskTitle,
            isDone: false
        }
        setTasks({
            ...tasks,
            [todoListId]: [newTask, ...tasks[todoListId]]
        })
    }
    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean, todoListId: string) => {
        setTasks({...tasks,
            [todoListId]: tasks[todoListId].map(t => t.id === taskId
                ? {...t, isDone : newIsDoneValue}
                : t)
        })
    }
    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        setTasks({...tasks,
            [todoListId]: tasks[todoListId].map(t => t.id === taskId
                ? {...t, title : title}
                : t)
        })
    }
    const getFilteredTasks = (tasks: Array<TaskType>, filter: FilterType) => {
        let tasksForTodoList = tasks;
        if (filter === "Active") {
            tasksForTodoList = tasks.filter(t => !t.isDone)
        }
        if (filter === "Completed") {
            tasksForTodoList = tasks.filter(t => t.isDone)
        }
        return tasksForTodoList
    }

    const todoListsComponents = todoLists.map(tl => {

        // const tasksForTodoList = getTasksForTodoList(tasks[tl.id], tl.filter)

        return (
            <Paper  style={{
                width: "300px",
                margin:"20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: " center",
                paddingBottom:"5px"
            }}
                    elevation={8}
                    key={tl.id}>
                <div className="App">
                    <TodoList
                        title={tl.title}
                        filter={tl.filter}
                        key={tl.id}
                        todoListId={tl.id}
                        tasks={getFilteredTasks(tasks[tl.id], tl.filter)}
                        changeTodoListFilter={changeTodoListFilter}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodoList={removeTodoList}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}
                    />
                </div>
            </Paper>
        );
    })
    return (
        <div className="App">
            <div className={"App"}>
                <AppBar position={"static"}>
                    <Toolbar style={{justifyContent:"space-between"}}>
                        <IconButton edge={"start"} color={"inherit"} aria-label={"menu"}>
                            <Menu/>
                        </IconButton>
                        <Typography variant={"h6"}>
                            TodoLists
                        </Typography>
                        <Button color={"inherit"} variant={"outlined"}>Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
            <Container fixed>
                <Grid container style={{marginLeft: "10px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
