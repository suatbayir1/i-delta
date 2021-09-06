// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";

// Types
import { GENERATE_DID } from "./didTypes";

// Notification
import { NotificationManager } from "react-notifications";

export const fetchGenerateDID = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}did/generate`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success(response.data.data.message, "Success", 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
            })
    }
}