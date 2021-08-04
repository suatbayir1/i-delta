// Types
import { ADD_SC_RESPONSE } from "./scTypes";

const initialState = {
    addSCResult: false,
}

const scReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SC_RESPONSE:
            return {
                ...state,
                addSCResult: action.payload,
            }
        default:
            return state;
    }
}

export default scReducer;