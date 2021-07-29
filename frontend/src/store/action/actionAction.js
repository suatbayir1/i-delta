// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";

// Types
import {
    ADD_ACTION_RESPONSE,
    GET_ACTIONS_RESPONSE,
    SET_SELECTED_ACTION,
    DELETE_ACTION_RESPONSE,
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
                    dispatch(fetchGetActions(payload));
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
                if (response.status === 200) {
                    const result = JSON.parse(response.data.data.data);
                    dispatch(getActionsResponse(result));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}

// SET_SELECTED_ACTION
export const setSelectedAction = (payload) => {
    return {
        type: SET_SELECTED_ACTION,
        payload,
    }
}

// DELETE ACTION RESPONSE
const deleteActionResponse = (payload) => {
    return {
        type: DELETE_ACTION_RESPONSE,
        payload,
    }
}

export const fetchDeleteAction = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}action/delete`;

        axios
            .delete(url, {
                headers: {
                    'token': getState().auth.token
                },
                data: { "id": payload["_id"]["$oid"] }
            })
            .then(response => {
                if (response.status === 200) {
                    console.log(payload);
                    dispatch(deleteActionResponse(response.data.data.message));
                    dispatch(fetchGetActions({ "projectID": payload["projectID"] }))
                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}