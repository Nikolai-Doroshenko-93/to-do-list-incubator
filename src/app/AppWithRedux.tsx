import React, {useEffect} from 'react';
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
import {CircularProgress, LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatchWithType} from "./store";
import {RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../state/auth-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed";
function AppWithRedux() {

    const  status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

    const  isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const  isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)


    const dispatch = useAppDispatchWithType()

    const logOut = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, [])

    if(!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

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
                    {isLoggedIn && <Button onClick={logOut} color="inherit">Log out</Button>}
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
