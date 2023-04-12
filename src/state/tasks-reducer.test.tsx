import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, setTasksAC, tasksReducer} from './tasks-reducer'
import { TasksStateType } from '../AppWithRedux'
import {AddTodolistAC, RemoveTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";



let  startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        'todolistId1': [
        {
            id: '1',
            title: 'CSS',
            description: "",
            completed: false,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId1',
            order: 0,
            addedDate: ""
        },
        {
            id: '2',
            title: 'JS',
            description: "",
            completed: true,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId1',
            order: 0,
            addedDate: ""
        },
        {
            id: '3',
            title: 'React',
            description: "",
            completed: false,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId1',
            order: 0,
            addedDate: ""
        }
    ],
        'todolistId2': [
        {
            id: '1', title: 'bread',
            description: "",
            completed: false,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId2',
            order: 0,
            addedDate: ""
        },
        {
            id: '2', title: 'milk',
            description: "",
            completed: true,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId2',
            order: 0,
            addedDate: ""
        },
        {
            id: '3', title: 'tea',
            description: "",
            completed: false,
            status: TaskStatuses.InProgress,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            todoListId: 'todolistId2',
            order: 0,
            addedDate: ""
        }
    ]
    }
});


test('correct task should be deleted from correct array', () => {


    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                description: "",
                completed: false,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ""
            },
            {
                id: '2',
                title: 'JS',
                description: "",
                completed: true,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ""
            },
            {
                id: '3',
                title: 'React',
                description: "",
                completed: false,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: 'todolistId1',
                order: 0,
                addedDate: ""
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
                description: "",
                completed: false,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ""
            },
            {
                id: '3', title: 'tea',
                description: "",
                completed: false,
                status: TaskStatuses.InProgress,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: 'todolistId2',
                order: 0,
                addedDate: ""
            }
        ]
    })

})

test('correct task should be added to correct array', () => {

    const action = addTaskAC('juce', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].completed).toBe(false)
});


test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('todolistId2','2', false)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].completed).toBe(false)
    expect(endState['todolistId1'][1].completed).toBe(true)
});


test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('todolistId2','2', 'coffee')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('coffee')
    expect(endState['todolistId1'][1].title).toBe('JS')
});

test('new array should be added when new todolist is added', () => {

    const action = AddTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
});

test('property with todolistId should be deleted', () => {

    const action = RemoveTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('tasks should be adde fot todolist', () => {
    const action = setTasksAC(startState['todolistId1'], 'todolistId1')
    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})