// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Overlay, Form, Columns, Grid, Input, MultiSelectDropdown,
    SelectDropdown, Button, IconFont, ComponentColor, ButtonType,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Utilities
import { history } from "../../history";

// Actions
import { fetchAddProject } from "../../store"

class AddProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectName: "",
            infrastructure: [],
            infrastructureList: ["Ethereum", "Solana", "Avalanche"]
        }
    }

    closeOverlay = () => {
        history.goBack();
    }

    handleValidation = () => {
        const { projectName, infrastructure } = this.state;

        if (projectName.trim() === "" || infrastructure.length === 0) {
            NotificationManager.error('Please fill out the form completely', 'Error', 3000)
            return false;
        }
        return true;
    }

    addProject = async () => {
        const { projectName, infrastructure } = this.state;

        if (this.handleValidation()) {
            const payload = {
                projectName,
                infrastructure,
                "userID": this.props.user["_id"]["$oid"],
                "actions": [],
            }

            await this.props.fetchAddProject(payload);
        }
    }

    handleChangeInfrastructure = (option) => {
        const { infrastructure } = this.state
        const optionExists = infrastructure.find(opt => opt === option)
        let updatedOptions = infrastructure

        if (optionExists) {
            updatedOptions = infrastructure.filter(fo => fo !== option)
        } else {
            updatedOptions = [...infrastructure, option]
        }

        this.setState({ infrastructure: updatedOptions })
    }

    render() {
        const { projectName, infrastructure, infrastructureList } = this.state;

        return (
            <Overlay visible={true}>
                <Overlay.Container maxWidth={700}>
                    <Overlay.Header
                        title="Create New Project"
                        onDismiss={this.closeOverlay}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Project Name"
                                        required={true}
                                    >
                                        <Input
                                            name="projectName"
                                            placeholder="Project Name.."
                                            onChange={(e) => { this.setState({ projectName: e.target.value }) }}
                                            value={projectName}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element label="Infrastructure">
                                        <MultiSelectDropdown
                                            emptyText={"Select Infrastructure"}
                                            options={infrastructureList}
                                            selectedOptions={infrastructure}
                                            onSelect={this.handleChangeInfrastructure}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Form.Footer>
                                <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                    onClick={this.closeOverlay}
                                />

                                <Button
                                    text="Save"
                                    icon={IconFont.Checkmark}
                                    color={ComponentColor.Success}
                                    type={ButtonType.Submit}
                                    onClick={this.addProject}
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
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAddProject: (payload) => dispatch(fetchAddProject(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProject);