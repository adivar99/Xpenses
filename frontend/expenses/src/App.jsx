import {CssBaseline, makeStyles, ReactChild, Route, Router, Switch, UINavBar} from './component';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { setAuthToken } from './auth/authDispatcher';
import GuardedRoute from './shared/GuardedRoute';
import Register from './auth/Register';
import ConfirmMessageComponent from "./shared/confirm/confirm-message-component";
import LoadingIndicatorComponent from './shared/loader/loading-indicator-component';
import Login from './auth/Login';
import { Redirect } from 'react-router-dom';
import AppNotificationComponent from './shared/notification/app-notification-component';

const useStyles = makeStyles((theme) => ({

    '@global': {
      body: {
        backgroundColor: '#e6e6e6'
      },
      footer:{
        marginTop:'calc(5% + 60px)',
        bottom: 0
      }
    },
    footer:{
      marginTop:'calc(5% + 60px)',
      bottom: 0
    }
  
  
}));

function App() {
    const classes = useStyles();
    const {user, token, isLoggedIn} = useSelector(state => state.auth);

    const auth = (user, token, isLoggedIn)

    let homePage = "/login"

    if(isLoggedIn)
        homePage = "/register"
    
    useEffect(() => {
        if(token && user){
            setAuthToken(token)
        }
    }, [token]);

    return (<React.Fragment>
        <LoadingIndicatorComponent></LoadingIndicatorComponent>
        <UINavBar />
        <ConfirmMessageComponent />
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <GuardedRoute path="/profile" component={Profile} auth={isLoggedIn} />
        </Switch>
        <AppNotificationComponent/>
    </React.Fragment>
    );
}

export default App;