// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";
import { history } from "../../history";

// Types
import {
    ADD_ACTION_RESPONSE,
    GET_ACTIONS_RESPONSE,
} from "./actionTypes";

// Notification
import { NotificationManager } from 'react-notifications';

// ADD ACTION
const addActionResponse = (payload) => {
    return {
        type: ADD_ACTION_RESPONSE,
        payload,
    }
}

export const fetchAddAction = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}action/add`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(addActionResponse(true));
                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(addActionResponse(false));
            })
    }
}

// GET ACTIONS
const getActionsResponse = (payload) => {
    return {
        type: GET_ACTIONS_RESPONSE,
        payload,
    }
}

export const fetchGetActions = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}action/get`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            })
    }
}