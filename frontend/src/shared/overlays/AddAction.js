// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Overlay, Form, Columns, Grid, Input, MultiSelectDropdown,
    Button, IconFont, ComponentColor, ButtonType,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Utilities
import { history } from "../../history";

// Actions
import { fetchAddAction } from "../../store"

class AddAction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            actionName: "",
        }
    }

    addAction = async () => {
        const { actionName } = this.state;
        const { selectedProject } = this.props;

        if (actionName.trim() === "") {
            NotificationManager.error('Please fill out the form completely', 'Error', 3000)
            return;
        }

        const payload = {
            "transactions": [],
            "projectID": selectedProject[0]['_id']['$oid'],
            "actionName": actionName
        }

        await this.props.fetchAddAction(payload);
    }

    render() {
        const { actionName } = this.state;
        const { visible, dismissOverlay } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={500}>
                    <Overlay.Header
                        title="Add New Action"
                        onDismiss={dismissOverlay}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Twelve}>
                                    <Form.Element
                                        label="Action Name"
                                        required={true}
                                    >
                                        <Input
                                            name="actionName"
                                            placeholder="Action Name.."
                                            onChange={(e) => { this.setState({ actionName: e.target.value }) }}
                                            value={actionName}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Form.Footer>
                                <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                    onClick={dismissOverlay}
                                />

                                <Button
                                    text="Save"
                                    icon={IconFont.Checkmark}
                                    color={ComponentColor.Success}
                                    type={ButtonType.Submit}
                                    onClick={this.addAction}
                                />
                            </Form.Footer>
                        </Form>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedProject: state.project.selectedProject
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAddAction: (payload) => dispatch(fetchAddAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAction);