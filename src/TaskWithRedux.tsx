import React, {ChangeEvent, memo} from "react";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./api/todolists-api";


type TasksPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (todolistId: string, id: string,  status: TaskStatuses) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
}

const TaskWithRedux = memo((props: TasksPropsType) => {




    const onClickHandler = () => props.removeTask(props.todolistId, props.task.id, )

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.todolistId, props.task.id,  newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New);
    }
    const onTitleChangeHandler = (newValue: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, newValue);
    }

    return (
        <div key={props.task.id} className={props.task.completed ? "is-done" : ""}>
            <Checkbox
                checked={props.task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeHandler}
            />
            <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
        )
})

export default TaskWithRedux