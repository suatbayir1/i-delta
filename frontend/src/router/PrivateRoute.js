import React, { useEffect } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from "react-redux";

const PrivateRoute = ({ user, token, component: Component, ...rest }) => {

    const isLoggedIn = token === "" ? false : true;

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
                )
            }
        />
    )
}


const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
