// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "./auth/authReducer";
import generalReducer from "./general/generalReducer";
import projectReducer from "./project/projectReducer";
import actionReducer from "./action/actionReducer";
import scReducer from "./sc/scReducer";
import didReducer from "./did/didReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    general: generalReducer,
    project: projectReducer,
    action: actionReducer,
    sc: scReducer,
    did: didReducer,
});

export default rootReducer;
