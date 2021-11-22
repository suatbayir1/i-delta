// Libraries
import axios from "axios";

// Constants
import { API_URL, NODE_URL } from "../../config";

// Types
import { GENERATE_DID_RESPONSE, CLEAR_KEY_PAIR, GET_DID_LIST } from "./didTypes";

// Notification
import { NotificationManager } from "react-notifications";

const generateDidResponse = (payload) => {
    return {
        type: GENERATE_DID_RESPONSE,
        payload,
    }
}

export const clearKeyPair = () => {
    return {
        type: CLEAR_KEY_PAIR,
    }
}

export const fetchGenerateDID = (payload, url) => {
    return (dispatch, getState) => {
        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    const key = response.data.data;
                    dispatch(generateDidResponse(key));
                    NotificationManager.success(response.data.message, "Success", 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

const getDidList = (payload) => {
    return {
        type: GET_DID_LIST,
        payload,
    }
}

export const fetchDidList = () => {
    return (dispatch, getState) => {
        let url = `${NODE_URL}did/`;

        axios
            .get(url, { headers: { 'token': getState().auth.token } })
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    const dids = response.data.dids;
                    dispatch(getDidList(dids));
                }
            })
            .catch(err => {
                console.log(err);
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

