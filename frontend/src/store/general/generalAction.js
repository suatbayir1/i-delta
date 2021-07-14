// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";
import { history } from "../../history";

// Types
import { LOADED, LOADING } from "./generalTypes";

// Notification
import { NotificationManager } from 'react-notifications';

// LOGIN
export const loading = () => {
    return {
        type: LOADING,
        payload: true,
    }
}

export const loaded = () => {
    return {
        type: LOADED,
        payload: false,
    }
}