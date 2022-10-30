import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';import {TaskType} from "../TodoList/TodoList";
import {v1} from "uuid";
import {IconButton, TextField} from "@material-ui/core";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

const AddItemForm = (props: AddItemFormPropsType) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState<boolean>(false)
    const onChangeSetLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false)
        setTitle(e.currentTarget.value)
    }
    const onEnterDownAddItem = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addItem();
    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle !== "") {
            props.addItem(trimmedTitle)
        } else {
            setError(true)
        }
        setTitle("")
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
            paddingRight: "2px",

        }}>
            <TextField
                value={title}
                onChange={onChangeSetLocalTitle}
                onKeyDown={onEnterDownAddItem}
                label={"Title"}
                variant={"outlined"}
                size={"small"}
                error={error}
                helperText={error && "Title is required"}
                style={{marginLeft: "10px"}}

            />
            <IconButton
                color={"primary"}
                onClick={addItem}
                size={"medium"}
                style={{}}
            >
                <AddBoxIcon></AddBoxIcon>
            </IconButton>
        </div>
    );
};

export default AddItemForm;