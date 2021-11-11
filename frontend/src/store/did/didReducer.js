import { GENERATE_DID_RESPONSE, CLEAR_KEY_PAIR, GET_DID_LIST } from "./didTypes";

const initialState = {
    keyPair: {},
    isTheKeyDownloadable: false,
    dids: []
}

const didReducer = (state = initialState, action) => {
    switch (action.type) {
        case GENERATE_DID_RESPONSE:
            return {
                ...state,
                keyPair: action.payload,
                isTheKeyDownloadable: true
            }
        case CLEAR_KEY_PAIR:
            return {
                ...state,
                keyPair: {},
                isTheKeyDownloadable: false,
            }
        case GET_DID_LIST:
            return {
                ...state,
                dids: action.payload
            }
        default:
            return state;
    }
}

export default didReducer;