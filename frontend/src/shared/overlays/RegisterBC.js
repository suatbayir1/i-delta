// Libraries
import React, { Component } from 'react'
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from "react-redux";

// import * as tronweb from "tronweb";


// Components
import {
    Form, Button, ButtonType, ComponentColor, Overlay, IconFont, Grid,
    FlexBox, Columns, ComponentSize, SelectDropdown, QuestionMarkTooltip,
    InfluxColors, Input, Tabs,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchAddBC } from "../../store/"

// Constants
import {
    tipStyle, example
} from '../constants/tips';

const TronWeb = require('tronweb');


class RegisterBC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bcTypes: [
                { id: "tron", text: "Tron" },
                { id: "avalanche", text: "Avalanche" },
                { id: "solana", text: "Solana" },
                { id: "algorand", text: "Algorand" },
                { id: "ethereum", text: "Ethereum" },
            ],
            selectedTab: { id: "tron", text: "Tron" },
            selectedNetwork: "Main Network",
            bcName: "",
        }
    }

    save = async () => {
        const { selectedNetwork, bcName, selectedTab } = this.state;
        const { user, fetchAddBC } = this.props;

        const payload = {
            selectedNetwork,
            bcName,
            "infrastructure": selectedTab.id,
            "userID": user["_id"]["$oid"],
        }

        await fetchAddBC(payload);
    }

    render() {
        const { visible, dismissOverlay } = this.props;
        const { selectedNetwork, bcTypes, selectedTab, bcName } = this.state;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={600}>
                    <Overlay.Header
                        title="Register Block Chain"
                        onDismiss={() => { dismissOverlay("visibleRegisterBC") }}
                    />

                    <Overlay.Body>
                        <Form>
                            <Tabs.Container style={{ marginBottom: '20px' }}>
                                <Tabs>
                                    {
                                        bcTypes.map(tab => {
                                            return (
                                                <Tabs.Tab
                                                    key={tab.id}
                                                    text={tab.text}
                                                    onClick={() => { this.setState({ selectedTab: tab }) }}
                                                    active={tab.id === selectedTab.id}
                                                />
                                            )
                                        })
                                    }
                                </Tabs>
                            </Tabs.Container>

                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="BC Name"
                                        required={true}
                                    >
                                        <Input
                                            placeholder="BC Name.."
                                            onChange={(e) => { this.setState({ bcName: e.target.value }) }}
                                            value={bcName}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element label="Select Network">
                                        <SelectDropdown
                                            options={["Main Network", "Test Network"]}
                                            selectedOption={selectedNetwork}
                                            onSelect={(e) => { this.setState({ selectedNetwork: e }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            {/* <Grid.Row>
                                <Tabs>
                                    <TabList>
                                        <Tab
                                            style={{ width: '100px', borderRight: '2px solid #aaa' }}
                                        >
                                            Tron
                                        </Tab>
                                        <Tab
                                            style={{ width: '100px', borderRight: '2px solid #aaa' }}
                                        >
                                            Tab 2
                                        </Tab>
                                        <Tab
                                            style={{ width: '100px', borderRight: '2px solid #aaa' }}
                                        >
                                            Tab 3
                                        </Tab>
                                    </TabList>

                                    <TabPanel>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element label="Select Network">
                                                <SelectDropdown
                                                    options={["Main Network", "Test Network"]}
                                                    selectedOption={selectedNetwork}
                                                    onSelect={(e) => { this.setState({ selectedNetwork: e }) }}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                    </TabPanel>
                                    <TabPanel>
                                        Panel 2
                                    </TabPanel>
                                    <TabPanel>
                                        Panel 3
                                    </TabPanel>
                                </Tabs>
                            </Grid.Row> */}

                            <Form.Footer>
                                <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                    onClick={() => { dismissOverlay("visibleRegisterBC") }}
                                />

                                <Button
                                    text="Save"
                                    icon={IconFont.Checkmark}
                                    color={ComponentColor.Success}
                                    type={ButtonType.Submit}
                                    onClick={this.save}
                                />
                            </Form.Footer>
                        </Form>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAddBC: (payload) => dispatch(fetchAddBC(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterBC);