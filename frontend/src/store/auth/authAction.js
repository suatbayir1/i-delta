// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";
import { history } from "../../history";

// Types
import { LOGIN_SUCCESS, LOGIN_ERROR, SIGNUP_SUCCESS, SIGNUP_ERROR, LOGOUT, UPDATE_PROFILE } from "./authTypes";

// Notification
import { NotificationManager } from 'react-notifications';

// Actions
import { loading, loaded } from "../general/generalAction";

// LOGIN
export const loginSuccess = (payload) => {
    return {
        type: LOGIN_SUCCESS,
        payload,
    }
}

export const loginError = (payload) => {
    return {
        type: LOGIN_ERROR,
        payload,
    }
}

export const fetchLogin = (payload) => {
    return (dispatch) => {
        let url = `${API_URL}auth/signIn`;

        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    const result = JSON.parse(response.data.data.data);
                    dispatch(loading());
                    dispatch(loginSuccess(result));

                    NotificationManager.success('You are being redirected to the home page', 'Login Successful', 2000);

                    // Redirect to home page after 2 second
                    setTimeout(() => {
                        history.push("/");
                        dispatch(loaded());
                    }, 2000)
                }
            })
            .catch(err => {
                dispatch(loginError(err.response.data.data.message))
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}

// SIGNUP
export const signupSuccess = (payload) => {
    return {
        type: SIGNUP_SUCCESS,
        payload,
    }
}

export const signupError = (payload) => {
    return {
        type: SIGNUP_ERROR,
        payload,
    }
}

export const fetchSignup = (payload) => {
    return (dispatch) => {
        let url = `${API_URL}auth/signUp`;

        axios
            .post(url, payload)
            .then(response => {
                if (response.status === 200) {
                    dispatch(loading());
                    dispatch(signupSuccess(response.data.data.message));

                    NotificationManager.success(`${response.data.data.message}. You are being redirected to the Sign In page.`, 'Success', 2000);

                    setTimeout(() => {
                        history.push("/sign-in");
                        dispatch(loaded());
                    }, 2000)
                }
            })
            .catch(err => {
                dispatch(signupError(err.response.data.data.message))
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}


// LOGOUT
export const logout = () => {
    return {
        type: LOGOUT,
    }
}


const updateProfile = (payload) => {
    return {
        type: UPDATE_PROFILE,
        payload,
    }
}

export const fetchUpdateProfile = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}auth/profile/edit`;

        axios
            .put(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    const result = JSON.parse(response.data.data.data);
                    dispatch(updateProfile(result));
                    NotificationManager.success(response.data.data.message, 'Success', 2000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}