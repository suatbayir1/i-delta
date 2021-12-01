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

const initialState = {
    keyPair: {},
    isTheKeyDownloadable: false,
    dids: [],
    resolvedDid: {},
    isResolvedDidVisible: false,
    myDid: {},
    selectedDidTab: "generate-did",
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
        case RESOLVE_DID:
            return {
                ...state,
                resolvedDid: action.payload,
                isResolvedDidVisible: true,
            }
        case CLEAR_RESOLVED_DID:
            return {
                ...state,
                resolvedDid: {},
                isResolvedDidVisible: false
            }
        case GET_SINGLE_DID:
            return {
                ...state,
                myDid: action.payload,
            }
        case DELETE_DID:
            return {
                ...state,
                myDid: {},
            }
        case CHANGE_DID_SELECTED_TAB:
            return {
                ...state,
                selectedDidTab: action.payload
            }
        default:
            return state;
    }
}

export default didReducer;