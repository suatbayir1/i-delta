// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";

// Types
import {
    ADD_TRANSACTION_RESPONSE,
    DELETE_TRANSACTION_RESPONSE,
} from "./transactionTypes";

// Actions
import { fetchGetActions } from "../index"

// Notification
import { NotificationManager } from 'react-notifications';

// ADD TRANSACTION
const addTransactionResponse = (payload) => {
    return {
        type: ADD_TRANSACTION_RESPONSE,
        payload,
    }
}

export const fetchAddTransaction = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}transaction/add`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(addTransactionResponse(true));
                    dispatch(fetchGetActions(payload));
                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(addTransactionResponse(false));
            })
    }
}

// DELETE TRANSACTION
const deleteTransactionResponse = (payload) => {
    return {
        type: DELETE_TRANSACTION_RESPONSE,
        payload,
    }
}

export const fetchDeleteTransaction = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}transaction/delete`;

        axios
            .delete(url, {
                headers: {
                    'token': getState().auth.token
                },
                data: payload,
            })
            .then(response => {
                if (response.status === 200) {
                    dispatch(deleteTransactionResponse(true));
                    dispatch(fetchGetActions({ "projectID": getState().project.selectedProject[0]["_id"]["$oid"] }))
                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(deleteTransactionResponse(false));
            })
    }
}