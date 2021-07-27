// Libraries
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Components
import {
    Panel, ResourceCard, DapperScrollbars, Overlay, Form, Grid, Columns, ComponentColor, IconFont, Context,
    ButtonType, Button, ComponentSize, FlexBox, Appearance, ConfirmationButton,
} from '@influxdata/clockface'

// Utilities
import { history } from "../../history";

// Helpers
import { exportJSON } from "../../helpers/FileExport";

// Actions
import { fetchGetProjects, fetchDeleteProject, fetchCloneProject, fetchUpdateProject } from "../../store"

class Projects extends Component {
    componentDidMount = async () => {
        await this.props.fetchGetProjects();
    }

    handleClickProject = (project) => {
        history.push(`/project/${project['_id']['$oid']}`);
    }

    closeOverlay = () => {
        history.push("/");
    }

    handleUpdateProject = async (newName, project) => {
        if (newName !== project["projectName"]) {
            const payload = {
                "projectName": newName,
                "id": project["_id"]["$oid"],
            }

            await this.props.fetchUpdateProject(payload);
        }
    }

    addProject = () => {
        history.push("/add-project")
    }

    contextMenu = (project) => {
        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <ConfirmationButton
                        icon={IconFont.Export}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { exportJSON(project["projectName"], project) }}
                        text={""}
                        popoverColor={ComponentColor.Primary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Primary}
                        confirmationLabel="Do you want to export ?"
                        confirmationButtonColor={ComponentColor.Primary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Duplicate}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchCloneProject(project) }}
                        text={""}
                        popoverColor={ComponentColor.Secondary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Secondary}
                        confirmationLabel="Do you want to clone ?"
                        confirmationButtonColor={ComponentColor.Secondary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Trash}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchDeleteProject({ "id": project["_id"]["$oid"] }) }}
                        text={""}
                        popoverColor={ComponentColor.Danger}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Danger}
                        confirmationLabel="Do you want to delete ?"
                        confirmationButtonColor={ComponentColor.Danger}
                        confirmationButtonText="Yes"
                    />
                </FlexBox>
            </>
        )
    }

    render() {
        const { projects } = this.props;

        return (
            <Overlay visible={true}>
                <Overlay.Container maxWidth={1500}>
                    <Overlay.Header
                        title="My Projects"
                        onDismiss={this.closeOverlay}
                    />

                    <Overlay.Body>
                        <Form>
                            <DapperScrollbars
                                autoHide={false}
                                autoSizeHeight={true}
                                style={{ maxHeight: '700px' }}
                                className="data-loading--scroll-content"
                            >
                                <Grid.Column widthSM={Columns.Three}
                                >
                                    <div onClick={this.addProject}>
                                        <ResourceCard style={{ height: '200px', cursor: 'pointer' }}>
                                            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                                                <Button
                                                    text=""
                                                    onClick={this.addProject}
                                                    type={ButtonType.Button}
                                                    icon={IconFont.Plus}
                                                    color={ComponentColor.Primary}
                                                    size={ComponentSize.Medium}
                                                />

                                                <h6>Add Project</h6>
                                            </div>
                                        </ResourceCard>
                                    </div>
                                </Grid.Column>

                                {
                                    projects.length > 0 && projects.map((project, idx) =>
                                        <Grid.Column widthSM={Columns.Three}
                                            style={{ marginBottom: '40px' }}
                                            key={idx}
                                        >
                                            <ResourceCard
                                                key={`dashboard-id`}
                                                testID="dashboard-card"
                                                contextMenu={this.contextMenu(project)}
                                                style={{ height: '200px' }}
                                            >
                                                <ResourceCard.EditableName
                                                    onUpdate={(e) => { this.handleUpdateProject(e, project) }}
                                                    onClick={() => { this.handleClickProject(project) }}
                                                    name={
                                                        String(project.projectName).length > 25
                                                            ? `${String(project.projectName).substring(0, 25)} ...`
                                                            : project.projectName
                                                    }
                                                    noNameString={"default name"}
                                                />
                                                <ResourceCard.Description
                                                    onUpdate={this.handleUpdateDescription}
                                                    description={Object.values(project.infrastructure).join(", ")}
                                                    placeholder={`Describe name`}
                                                />
                                                <ResourceCard.Meta style={{ marginTop: '20px' }}>
                                                    <>{`Created At: ${new Date(project.createdAt.$date).toUTCString()}`}</>
                                                </ResourceCard.Meta>
                                                <ResourceCard.Meta style={{ marginTop: '0px' }}>
                                                    <>{`Last Modified: ${new Date(project.updatedAt.$date).toUTCString()}`}</>
                                                </ResourceCard.Meta>
                                            </ResourceCard>
                                        </Grid.Column>
                                    )
                                }
                            </DapperScrollbars>
                        </Form>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.project.projects
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetProjects: () => dispatch(fetchGetProjects()),
        fetchDeleteProject: (payload) => dispatch(fetchDeleteProject(payload)),
        fetchCloneProject: (payload) => dispatch(fetchCloneProject(payload)),
        fetchUpdateProject: (payload) => dispatch(fetchUpdateProject(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);