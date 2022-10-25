import React, {useState} from 'react';
import { v1 } from 'uuid';
import './App.css';
import {TodoList} from './TodoList/TodoList';
import {TaskType} from "./TodoList/TodoList";
import AddItemForm from "./AddItemForm/AddItemForm";

export type FilterType  = "All" | "Active"| "Completed"

type TodoListType = {
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
    const changeTodoListFilter = (filterVal: FilterType, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, filter: filterVal} : tl))
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
    }
    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListId))
        delete tasks[todoListId]
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
    const addTodoList = (title: string) => {
        const newTodoListId = v1()
        const newTodoList: TodoListType = {
            id: newTodoListId,
            title: title,
            filter: "All"
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListId]: []})
    }
    const todoListsComponents = todoLists.map(tl => {

        // const tasksForTodoList = getTasksForTodoList(tasks[tl.id], tl.filter)

        return (
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
        );
    })
    return (
        <div className="App">
            <AddItemForm addItem={addTodoList}/>
            {todoListsComponents}
        </div>
    );
}

export default App;
