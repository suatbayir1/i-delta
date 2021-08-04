// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";

// Types
import { ADD_SC_RESPONSE } from "./scTypes";

// Notification
import { NotificationManager } from "react-notifications";

const addSCResponse = (payload) => {
    return {
        type: ADD_SC_RESPONSE,
        payload,
    }
}

export const fetchAddSC = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}sc/add`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(addSCResponse(true));
                    NotificationManager.success(response.data.data.message, "Success", 3000);
                }
            })
            .catch(err => {
                dispatch(addSCResponse(false));
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}