import React, {useCallback, useEffect, useMemo} from 'react';
import {FilterValuesType} from '../../../app/AppWithRedux';
import {AddItemForm} from '../../../component/AddItemForn/AddItemForm';
import {EditableSpan} from '../../../component/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import {Button} from "@mui/material";
import TaskWithRedux from "./Task/TaskWithRedux";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {getTasksTC} from "../../../state/tasks-reducer";
import {useAppDispatchWithType} from "../../../app/store";
import {RequestStatusType} from "../../../app/app-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (todolistId: string, id: string, status: TaskStatuses) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    entityStatus: RequestStatusType
}




export const Todolist = React.memo((props: PropsType) => {

    const dispatch = useAppDispatchWithType()

    useEffect(() => {
        dispatch(getTasksTC(props.id))
    }, [props.id])

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])
    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.id]);


    let tasks = useMemo(() => {
        let tasks = props.tasks;

        if (props.filter === "active") {
            tasks = tasks.filter(t => t.completed);
        }
        if (props.filter === "completed") {
            tasks = tasks.filter(t => t.completed);
        }
        return tasks
    }, [props.filter, props.tasks])

    const removeTask = useCallback((id: string, taskId: string) => {
        props.removeTask(props.id, taskId)
    }, [props.removeTask, props.id])
    const changeTaskStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        props.changeTaskStatus(props.id, taskId, status);
    }, [props.changeTaskStatus, props.id])
    //

    return (<div>
            <h3> <EditableSpan value={props.title} onChange={changeTodolistTitle} />
                <IconButton
                    onClick={removeTodolist}
                    disabled={props.entityStatus === 'loading'}
                >
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}
                         disabled={props.entityStatus === 'loading'}
            />
            <div>

                {

                    tasks.map(t => {
                        return <TaskWithRedux
                            key={t.id}
                            task={t}
                            removeTask={removeTask}
                            changeTaskTitle={props.changeTaskTitle}
                            changeTaskStatus={changeTaskStatus}
                            todolistId={props.id}
                            disabled={props.entityStatus === 'loading'}

                        />
                    })
                }
            </div>
            <div>
                <ButtonWithMemo
                    title={'All'}
                    color={'inherit'}
                    variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                />
                <ButtonWithMemo
                    title={'Active'}
                    color={'inherit'}
                    variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                />
                <ButtonWithMemo
                    title={'Completed'}
                    color={'secondary'}
                    variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                />
            </div>
        </div>
    )
});

type ButtonWithMemoPropsType = {
    title: string
    onClick: () => void
    color:  'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    variant: 'text' | 'outlined' | 'contained'
};

const ButtonWithMemo = React.memo((props: ButtonWithMemoPropsType) => {
    return (
        <Button
            variant={props.variant}
            onClick={props.onClick}
            color={props.color}
        >
            {props.title}
        </Button>
    )
});