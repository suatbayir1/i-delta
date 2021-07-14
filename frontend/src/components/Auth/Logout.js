// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Actions
import { logout } from "../../store";

class Logout extends Component {
    componentDidMount() {
        console.log("logout");
        this.props.logout();
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: (payload) => dispatch(logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
