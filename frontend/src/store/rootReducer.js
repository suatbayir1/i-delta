// Libraries
import { combineReducers } from "redux";

// Reducers
import authReducer from "./auth/authReducer";
import generalReducer from "./general/generalReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    general: generalReducer,
});

export default rootReducer;
