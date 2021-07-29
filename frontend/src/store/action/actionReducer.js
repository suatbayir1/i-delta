import { GET_ACTIONS_RESPONSE, SET_SELECTED_ACTION } from "./actionTypes";

const initialState = {
    actions: [],
    selectedAction: {},
}

const actionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ACTIONS_RESPONSE:
            return {
                ...state,
                actions: action.payload,
            }
        case SET_SELECTED_ACTION:
            return {
                ...state,
                selectedAction: action.payload,
            }
        default:
            return state;
    }
}

export default actionReducer;