import { LOGIN_ERROR, LOGIN_SUCCESS, SIGNUP_SUCCESS, SIGNUP_ERROR, LOGOUT } from "./authTypes";

const initialState = {
    token: "",
    user: {},
    successMessage: "",
    errorMessage: "",
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
            }
        case LOGIN_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                successMessage: action.payload
            }
        case SIGNUP_ERROR:
            return {
                ...state,
                errorMessage: action.payload
            }
        case LOGOUT:
            return {
                ...state,
                token: "",
                user: {},
                successMessage: "",
                errorMessage: "",
            }
        default:
            return state;
    }
}

export default authReducer;