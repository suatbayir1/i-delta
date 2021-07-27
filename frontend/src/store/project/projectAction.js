// Libraries
import axios from "axios";

// Constants
import { API_URL } from "../../config";
import { history } from "../../history";

// Types
import {
    ADD_PROJECT_RESPONSE,
    GET_PROJECTS_RESPONSE,
    DELETE_PROJECT_RESPONSE,
    CLONE_PROJECT_RESPONSE,
    UPDATE_PROJECT_RESPONSE,
    GET_PROJECT_RESPONSE,
} from "./projectTypes";

// Notification
import { NotificationManager } from 'react-notifications';

// ADD PROJECT
export const addProjectResponse = (payload) => {
    return {
        type: ADD_PROJECT_RESPONSE,
        payload,
    }
}

export const fetchAddProject = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/add`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(addProjectResponse(response.data.data.message));

                    dispatch(fetchGetProjects());

                    NotificationManager.success('The new project has been successfully created. You are being redirected to the project list', 'Operation Successful', 3000);

                    // Redirect to project list page after 2 second
                    setTimeout(() => {
                        history.push("/my-projects");
                    }, 500)
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(addProjectResponse(err.response.data.data.message));
            })
    }
}

// GET PROJECTS
export const getProjectsResponse = (payload) => {
    return {
        type: GET_PROJECTS_RESPONSE,
        payload,
    }
}

export const fetchGetProjects = () => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/get`;

        axios
            .get(url, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    const result = JSON.parse(response.data.data.data);
                    dispatch(getProjectsResponse(result));
                }
            })
            .catch(err => {
                dispatch(getProjectsResponse([]));
            })
    }
}

// GET PROJECT
export const getProjectResponse = (payload) => {
    return {
        type: GET_PROJECT_RESPONSE,
        payload,
    }
}

export const fetchGetProject = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/getById`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    const result = JSON.parse(response.data.data.data);
                    dispatch(getProjectResponse(result))
                }
            })
            .catch(err => {
                dispatch(getProjectResponse([]));
            })
    }
}

// DELETE PROJECT
export const deleteProjectResponse = (payload) => {
    return {
        type: DELETE_PROJECT_RESPONSE,
        payload,
    }
}

export const fetchDeleteProject = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/delete`;

        axios
            .delete(url, {
                headers: {
                    'token': getState().auth.token
                },
                data: payload
            })
            .then(response => {
                if (response.status === 200) {
                    dispatch(deleteProjectResponse(response.data.data.message));
                    dispatch(fetchGetProjects());

                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(deleteProjectResponse(err.response.data.data.message));
            })
    }
}

// CLONE PROJECT
export const cloneProjectResponse = (payload) => {
    return {
        type: CLONE_PROJECT_RESPONSE,
        payload,
    }
}

export const fetchCloneProject = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/clone`;

        axios
            .post(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(cloneProjectResponse(response.data.data.message));
                    dispatch(fetchGetProjects());

                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(cloneProjectResponse(err.response.data.data.message));
            })
    }
}

// UPDATE PROJECT
export const updateProjectResponse = (payload) => {
    return {
        type: UPDATE_PROJECT_RESPONSE,
        payload,
    }
}

export const fetchUpdateProject = (payload) => {
    return (dispatch, getState) => {
        let url = `${API_URL}project/update`;

        axios
            .put(url, payload, { headers: { 'token': getState().auth.token } })
            .then(response => {
                if (response.status === 200) {
                    dispatch(updateProjectResponse(response.data.data.message));
                    dispatch(fetchGetProjects());

                    NotificationManager.success(response.data.data.message, 'Success', 3000);
                }
            })
            .catch(err => {
                NotificationManager.error(err.response.data.data.message, 'Error', 3000);
                dispatch(updateProjectResponse(err.response.data.data.message));
            })
    }
}