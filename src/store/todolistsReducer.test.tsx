import {FilterType, TodoListType} from "../App";
import {v1} from "uuid";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodoListAC,
    todoListsReducer
} from "./todolistsReducer";

test ('correct todoList should be removed', ()=> {

    let todoListId_1 = v1()
    let todoListId_2 = v1()

    const startState: Array<TodoListType> = [
        {id: todoListId_1, title: "What to learn today", filter: "All"},
        {id: todoListId_2, title: "What to buy", filter: "All"}
    ]

    const endState = todoListsReducer(startState, RemoveTodoListAC(todoListId_1))

    expect (endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId_2);
});
test ('correct added', () => {
    let todoListId_1 = v1()
    let todoListId_2 = v1()
    let newTodoListTitle = "New Todolist"
    const startState: Array<TodoListType> = [
        {id: todoListId_1, title: "What to learn today", filter: "All"},
        {id: todoListId_2, title: "What to buy", filter: "All"}
    ]
    const endState = todoListsReducer(startState, AddTodoListAC(v1(), newTodoListTitle))
    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodoListTitle)
})
test ('correct filter', ()=> {
    let todoListId_1 = v1()
    let todoListId_2 = v1()
    let newFilter: FilterType = "Completed"
    const startState: Array<TodoListType> = [
        {id: todoListId_1, title: "What to learn today", filter: "All"},
        {id: todoListId_2, title: "What to buy", filter: "All"}
    ]
    const endState = todoListsReducer(startState, ChangeTodoListFilterAC(todoListId_2, newFilter))

    expect(endState[0].filter).toBe("All")
    expect(endState[1].filter).toBe(newFilter)
})
test ('correct change title', () => {
    let todoListId_1 = v1()
    let todoListId_2 = v1()

    let newTitle = "New todolist"

    const startState: Array<TodoListType> = [
        {id: todoListId_1, title: "What to learn today", filter: "All"},
        {id: todoListId_2, title: "What to buy", filter: "All"}
    ]

    const endState = todoListsReducer(startState,  ChangeTodoListTitleAC(todoListId_2, newTitle))

    expect(endState[0].title).toBe('What to learn today');
    expect(endState[1].title).toBe(newTitle)
})
