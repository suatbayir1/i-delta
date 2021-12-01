// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Components
import {
    ResourceList, ConfirmationButton, Appearance, ResourceCard, ComponentSize,
    FlexBox, IconFont, ComponentColor, Button,
} from '@influxdata/clockface'

// Helpers
import { mongoDateToString } from "../../helpers/DateOperations";

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { myDid } = this.props;

        return (
            <>
                <h2>change password</h2>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);