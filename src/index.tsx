import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import { createTheme } from '@material-ui/core/styles'
import {red, teal, yellow} from "@material-ui/core/colors";
import {dark} from "@material-ui/core/styles/createPalette";

const theme = createTheme({
    palette: {
        primary: yellow,
        secondary: teal,
        type: "dark"
    }
})


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
    ,  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
