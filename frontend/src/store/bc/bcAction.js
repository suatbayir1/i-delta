// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";

// Types
import { ADD_BC_RESPONSE } from "./bcTypes";

// Notification
import { NotificationManager } from "react-notifications";

const addBCResponse = (payload) => {
    return {
        type: ADD_BC_RESPONSE,
        payload,
    }
}

export const fetchAddBC = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}bc/add`;

        console.log(url);
        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(addBCResponse(true));
                    NotificationManager.success(response.data.data.message, "Success", 3000);
                }
            })
            .catch(err => {
                dispatch(addBCResponse(false));
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}