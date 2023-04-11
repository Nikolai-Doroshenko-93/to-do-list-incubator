import React from "react";
import {AppRootStateType, store} from "./store";
import AppWithRedux from "../AppWithRedux";
import {Provider} from "react-redux";
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer} from "./todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: "", order: 0},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: "", order: 0}
    ],
    tasks: {
        ['todolistId1']: [
            {
                description: "",
                title: "Css",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: 'todolistId1',
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
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ""
            }
        ],
        ['todolistId2']: [
            {
                description: "",
                title: "Milk",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: v1(),
                todoListId: 'todolistId2',
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
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ""
            }
        ]
    }
}
 export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}