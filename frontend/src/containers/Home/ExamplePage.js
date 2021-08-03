// Libraries
import React, { Component } from 'react'

// Components
import { Page, Grid, DapperScrollbars } from '@influxdata/clockface'


class ExamplePage extends Component {
    render() {
        return (
            <Page>
                <Page.Header fullWidth={true}>
                    <Page.Title title={"Home Page"}
                    />
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
                                <h2>Home page contents will be here</h2>
                            </Grid.Row>
                        </Grid>
                    </DapperScrollbars>
                </Page.Contents>
            </Page>
        )
    }
}

export default ExamplePage