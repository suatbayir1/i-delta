import { ADD_PROJECT_RESPONSE, GET_PROJECTS_RESPONSE, GET_PROJECT_RESPONSE } from "./projectTypes";

const initialState = {
    addProjectMessage: "",
    projects: [],
    selectedProject: [],
}

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PROJECT_RESPONSE:
            return {
                ...state,
                addProjectMessage: action.payload,
            }
        case GET_PROJECTS_RESPONSE:
            return {
                ...state,
                projects: action.payload,
            }
        case GET_PROJECT_RESPONSE:
            return {
                ...state,
                selectedProject: action.payload,
            }
        default:
            return state;
    }
}

export default projectReducer;