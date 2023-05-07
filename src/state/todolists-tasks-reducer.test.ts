import {TasksStateType} from "../app/AppWithRedux";
import {tasksReducer} from "./tasks-reducer";
import {AddTodolistAC, SetTodolistsAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";

// test('ids should be equals', () => {
//     const startTasksState: TasksStateType = {}
//     const startTodolistsState: Array<TodolistDomainType> = []
//
//     const action = AddTodolistAC('new todolist')
//
//     const endTasksState = tasksReducer(startTasksState, action)
//     const endTodolistsState = todolistsReducer(startTodolistsState, action)
//
//     const keys = Object.keys(endTasksState)
//     const idFromTasks = keys[0]
//     const idFromTodolists = endTodolistsState[0].id
//
//     expect(idFromTasks).toBe(action.todolistId)
//     expect(idFromTodolists).toBe(action.todolistId)
// })

test ('empty arrays should be adde when we set todolists', () => {
    const action = SetTodolistsAC ([
        {id: "1", title: "What to learn", addedDate: "", order: 0},
        {id: "2", title: "What to buy",  addedDate: "", order: 0}
    ])
    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["1"]).toStrictEqual([])
    expect(endState["2"]).toStrictEqual([])
})