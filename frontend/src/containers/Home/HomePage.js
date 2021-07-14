// Libraries
import React, { Component } from 'react'

// Components
import { Page, Grid, Columns, DapperScrollbars } from '@influxdata/clockface'
import LeftSideOperations from "../../components/Home/LeftSideOperations";
import MiddleSequenceDiagram from "../../components/Home/MiddleSequenceDiagram";
import RightSideInformation from "../../components/Home/RightSideInformation";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sequenceDiagramText: ``,
        }
    }

    handleChangeSequenceDiagram = (text) => {
        this.setState({ sequenceDiagramText: text });
    }

    render() {
        const { sequenceDiagramText } = this.state;

        return (
            <Page>
                <Page.Header fullWidth={true}>
                    <Page.Title title={"Home Page"} />
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

export default HomePage;