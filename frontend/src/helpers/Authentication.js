import store from "../store/store";

export const isAuthorized = (requiredRole) => {
    const { user } = store.getState().auth;

    if (requiredRole.includes(user.role)) {
        return true;
    }
    return false;
}