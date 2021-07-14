import { LOADED, LOADING } from "./generalTypes";

const initialState = {
    isLoading: false,
}

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADED:
            return {
                ...state,
                isLoading: action.payload
            }
        case LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state;
    }
}

export default generalReducer;