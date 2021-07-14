// Libraries
import React, { Component } from 'react'
import { JsonEditor as Editor } from 'jsoneditor-react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns,
    ComponentColor, IconFont, Button, ButtonType,
} from '@influxdata/clockface'

// Constants
import sampleData from "../../shared/constants/sampleData"

class RightSideInformation extends Component {
    render() {
        return (
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <Grid>
                        <Grid.Row>
                            {/* <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                                <JSONInput
                                    placeholder={sampleData} // data to display
                                    theme="dark_vscode_tribute"
                                    locale={locale}
                                    colors={{
                                        string: "#DAA520" // overrides theme colors with whatever color value you want
                                    }}
                                    height="550px"
                                    width="100%"
                                />
                            </div> */}
                            <textarea
                                rows={4}
                                onChange={(e) => { this.props.handleChangeSequenceDiagram(e.target.value) }}
                                style={{ width: '100%', height: "400px", backgroundColor: '#1f2020', color: 'white' }}
                                value={this.props.sequenceDiagramText}
                            ></textarea>

                        </Grid.Row>
                    </Grid>
                </Panel.Header>
            </Panel>
        )
    }
}

export default RightSideInformation;