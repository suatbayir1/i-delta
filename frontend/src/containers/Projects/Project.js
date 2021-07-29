// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import { Page, Grid, Columns, DapperScrollbars } from '@influxdata/clockface'
import LeftSideOperations from "../../components/Project/LeftSideOperations";
import MiddleSequenceDiagram from "../../components/Project/MiddleSequenceDiagram";
import RightSideInformation from "../../components/Project/RightSideInformation";

// Actions
import { fetchGetProject, fetchGetActions } from "../../store"

class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sequenceDiagramText: ``,
        }
    }

    componentDidMount = async () => {
        await this.props.fetchGetProject({ "id": this.props.match.params.id })
        await this.props.fetchGetActions({ "projectID": this.props.match.params.id })
    }

    handleChangeSequenceDiagram = (text) => {
        this.setState({ sequenceDiagramText: text });
    }

    render() {
        const { sequenceDiagramText } = this.state;

        return (
            <Page>
                <Page.Header fullWidth={true}>
                    <Page.Title title={`Project - ${this.props.selectedProject[0].projectName}`} />
                </Page.Header>


                <Page.Contents fullWidth={true}>
                    <DapperScrollbars
                        autoHide={false}
                        noScrollX={true}
                        autoSizeHeight={true}
                        style={{ maxHeight: '800px' }}
                        className="data-loading--scroll-content"
                    >
                        <Grid>
                            <Grid.Row>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Four}
                                    widthMD={Columns.Two}
                                    widthLG={Columns.Two}
                                    style={{ marginTop: '20px' }}
                                >
                                    <LeftSideOperations />
                                </Grid.Column>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Eight}
                                    widthMD={Columns.Seven}
                                    widthLG={Columns.Seven}
                                    style={{ marginTop: '20px' }}
                                >
                                    <MiddleSequenceDiagram sequenceDiagramText={sequenceDiagramText} />
                                </Grid.Column>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Twelve}
                                    widthMD={Columns.Three}
                                    widthLG={Columns.Three}
                                    style={{ marginTop: '20px' }}
                                >
                                    <RightSideInformation
                                        sequenceDiagramText={sequenceDiagramText}
                                        handleChangeSequenceDiagram={this.handleChangeSequenceDiagram}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </DapperScrollbars>
                </Page.Contents>
            </Page>
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
        fetchGetProject: (payload) => dispatch(fetchGetProject(payload)),
        fetchGetActions: (payload) => dispatch(fetchGetActions(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);