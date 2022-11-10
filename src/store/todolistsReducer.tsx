import {FilterType, TodoListType} from "../App"
import {v1} from "uuid";

type RemoveTodoListAT = {
    type: "REMOVE-TODOLIST"
    todoListId: string
}
type AddTodoListAT = {
    type: "ADD-TODOLIST",
    title: string,
    todoListId: string
}
type ChangeTodoListFilterAT = {
    type: "CHANGE-TODOLIST-FILTER",
    filter: FilterType,
    todoListId: string
}
type ChangeTodoListTitleAT = {
    type: "CHANGE-TODOLIST-TITLE",
    title: string,
    todoListId: string
}

type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListFilterAT | ChangeTodoListTitleAT

export const todoListsReducer = (todoLists:Array<TodoListType>, action:  ActionType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(tl => tl.id !== action.todoListId)
        case "ADD-TODOLIST":
            const newTodoList: TodoListType = {
                id: action.todoListId,
                title: action.title,
                filter: "All"
            }
            return [...todoLists, newTodoList]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
        default :
            return todoLists
    }
}

export const RemoveTodoListAC = (id: string):RemoveTodoListAT =>
    ({type: "REMOVE-TODOLIST", todoListId: id})
export const AddTodoListAC = (id: string, title: string):AddTodoListAT =>
    ({type: "ADD-TODOLIST", title: title, todoListId: id})
export const ChangeTodoListFilterAC = (id: string, filter: FilterType):ChangeTodoListFilterAT =>
    ({type: "CHANGE-TODOLIST-FILTER", filter: filter, todoListId: id})
export const ChangeTodoListTitleAC = (id: string, title: string):ChangeTodoListTitleAT =>
    ({type: "CHANGE-TODOLIST-TITLE", title: title, todoListId: id})