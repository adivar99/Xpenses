import environment from "../environment";
import http from "../shared/services/http-service.js";
import {concatMap, map} from "rxjs/operators";
import { LOGOUT } from "./authStore";
import { getAsUser } from "./user";
// import { appNotification } from "../shared/notification/app-notification";

export const doLogin = (loginRequest) => {

    clearAuthToken();
    return getToken(loginRequest)
        .pipe(
            concatMap((token) => getMyDetailsWithToken(token)),
        );
}

export const getToken = (loginRequest) => {
    const url = environment.baseUrl + "/auth/login"

    return http.post(url, loginRequest)
        .pipe(
            map((response) => {
                return response.token
            })
        );
}

export const doRegisterUser = (registerRequest) => {
    const url = environment.baseUrl + "/auth/register";

    return http.post(url, registerRequest)
    .pipe(
        concatMap((response) => {
            const loginRequest = {};

            loginRequest.username = registerRequest.username;
            loginRequest.password = registerRequest.password;
            return doLogin(loginRequest)
        })
    );
}

const getMyDetailsWithToken = (token) => {

    const url = environment.baseUrl + "/user/details/";
    setAuthToken(token)

    return http.get(url).pipe(
        map((userObject) => {

            const authInfo = []
            authInfo.token = token;
            authInfo.user = getAsUser(userObject);

            console.log(authInfo)
            return authInfo
        })
    );
}

export const setAuthToken = (token) => {
    http.setToken(token)
}

export const clearAuthToken = () => {
    http.setToken(null)
}

export const doLogOut = (dispatch,history) => {

    dispatch({type: LOGOUT});
    setAuthToken(null)
    localStorage.clear()
    history.push("/")
}