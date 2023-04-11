import React, {ChangeEvent, memo} from "react";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from "./api/todolists-api";


export type TasksPropsType = {
    todolistId: string,
    task: TaskType
}


const TaskWithRedux = memo(({
                   task,
                   todolistId
}: TasksPropsType) => {
    const dispatch = useDispatch()



    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistId))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;

        dispatch(changeTaskStatusAC(todolistId, task.id,  newIsDoneValue));
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(todolistId, task.id, newValue));
    }

    return (
        <div key={task.id} className={task.completed ? "is-done" : ""}>
            <Checkbox
                checked={task.completed}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
        )
})

export default TaskWithRedux