// Libraries
import axios from "axios";

// Constants
import { API_URL, NODE_URL } from "../../config";

// Types
import {
    GENERATE_DID_RESPONSE,
    CLEAR_KEY_PAIR,
    GET_DID_LIST,
    RESOLVE_DID,
    CLEAR_RESOLVED_DID,
    GET_SINGLE_DID,
    DELETE_DID,
    CHANGE_DID_SELECTED_TAB,
} from "./didTypes";

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
                if (response.status === 200) {
                    const key = response.data.data;
                    dispatch(generateDidResponse(key));
                    dispatch(fetchGetSingleDid(getState().auth.user["_id"]["$oid"]));
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
                if (response.status === 200) {
                    const dids = response.data.dids;
                    dispatch(getDidList(dids));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

const resolveDid = (payload) => {
    return {
        type: RESOLVE_DID,
        payload,
    }
}


export const fetchResolveDid = (url) => {
    return (dispatch, getState) => {

        axios
            .get(url, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(resolveDid(response.data.data));
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}

export const clearResolvedDid = () => {
    return {
        type: CLEAR_RESOLVED_DID,
    }
}

const getSingleDid = (payload) => {
    return {
        type: GET_SINGLE_DID,
        payload,
    }
}

export const fetchGetSingleDid = (userID) => {
    return (dispatch, getState) => {
        let url = `${NODE_URL}did/getSingleDid/${userID}`;

        axios
            .get(url, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(getSingleDid(response.data.data));
                }
            })
            .catch(err => {
                dispatch(getSingleDid({}));
            })
    }
}

const deleteDid = (payload) => {
    return {
        type: DELETE_DID,
        payload,
    }
}

export const fetchDeleteDid = (did) => {
    return (dispatch, getState) => {
        let url = `${NODE_URL}did/deleteEbsiDid/${did}`;

        axios
            .delete(url, {
                headers: {
                    'token': getState().auth.token
                },
            })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    dispatch(deleteDid());
                    dispatch(changeDidSelectedTab("generate-did"));
                    NotificationManager.success(response.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.message, 'Error', 3000);
            })
    }
}


const didSelectedTab = (payload) => {
    return {
        type: CHANGE_DID_SELECTED_TAB,
        payload,
    }
}

export const changeDidSelectedTab = (tab) => {
    return (dispatch) => {
        console.log(tab);
        dispatch(didSelectedTab(tab));
    }
}