import React from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar/AppBar';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/icons-material/Menu";
import {TaskType} from "../api/todolists-api";
import {ErrorSnackBar} from "../component/ErrorSnackBar/ErrorSnackBar";
import TodolistsList from "../features/TodolistList/TodolistList";
import {LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed";
function AppWithRedux() {
    const  status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    return (
        <div className="App">
            <ErrorSnackBar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}></Route>
                    <Route path={'/login'} element={<Login/>}></Route>
                    <Route path={'/404'} element={<h4>PAGE NOT FOUND</h4>}></Route>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}></Route>
                </Routes>
            </Container>
        </div>
    );
}

export default AppWithRedux;
