import React, {ChangeEvent, memo} from "react";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";



export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TasksPropsType = {
    todolistId: string,
    task: TaskType
}


const TaskWithRedux = memo(({
                   task,
                   todolistId
}: TasksPropsType) => {
    let {id, title, isDone} = task
    const dispatch = useDispatch()



    const onClickHandler = () => dispatch(removeTaskAC(id, todolistId))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;

        dispatch(changeTaskStatusAC(todolistId, id,  newIsDoneValue));
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(todolistId, id, newValue));
    }

    return (
        <div className={isDone ? "is-done" : ""}>
            <Checkbox
                checked={isDone}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
        )
})

export default TaskWithRedux