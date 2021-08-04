// Libraries
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from "react-redux";
import { JsonEditor as Editor } from 'jsoneditor-react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

// Components
import {
    Form, Button, ButtonType, ComponentColor, Overlay, IconFont, Grid, TextArea,
    Columns, Input, Tabs
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchAddSC } from "../../store/";

class RegisterSC extends Component {
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
            abiContent: "",
            contractAddress: "",
            contractName: "",
            isJsonCorrect: false,
        }
    }

    validateForm = () => {
        const { abiContent, contractAddress, contractName, isJsonCorrect } = this.state;

        if (abiContent.trim() === "" || contractAddress.trim() === "", contractName.trim() === "") {
            NotificationManager.warning("Please fill out the form completely", "Warning", 3000);
            return false;
        }

        if (isJsonCorrect !== false) {
            NotificationManager.warning("Please enter the JSON structure correctly", "Warning", 3000);
            return false;
        }

        return true;
    }

    save = async () => {
        const { abiContent, contractAddress, contractName, selectedTab } = this.state;
        const { user, fetchAddSC } = this.props;

        if (this.validateForm()) {
            const payload = {
                "userID": user["_id"]["$oid"],
                abiContent,
                contractAddress,
                contractName,
                "infrastructure": selectedTab.id
            }

            await fetchAddSC(payload);
        }
    }

    render() {
        const { visible, dismissOverlay } = this.props;
        const { bcTypes, selectedTab, abiContent, contractAddress, contractName } = this.state;

        const tronComponents = (
            <Grid.Row>
                <Grid.Column widthSM={Columns.Six}>
                    <Form.Element
                        label="Contract Name"
                        required={true}
                    >
                        <Input
                            placeholder="Contract Name.."
                            onChange={(e) => { this.setState({ contractName: e.target.value }) }}
                            value={contractName}
                        />
                    </Form.Element>
                </Grid.Column>

                <Grid.Column widthSM={Columns.Six}>
                    <Form.Element
                        label="Contract Address"
                        required={true}
                    >
                        <Input
                            placeholder="Contract Address.."
                            onChange={(e) => { this.setState({ contractAddress: e.target.value }) }}
                            value={contractAddress}
                        />
                    </Form.Element>
                </Grid.Column>

                <Grid.Column widthSM={Columns.Twelve}>
                    <Form.Element
                        label="Abi Content"
                        required={true}
                    >
                        {/* <TextArea
                            value={abiContent}
                            placeholder="Abi Content.."
                            onChange={(e) => { this.setState({ abiContent: e.target.value }) }}
                            rows={10}
                        /> */}
                        <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                            <JSONInput
                                // placeholder={sampleData} // data to display
                                theme="dark_vscode_tribute"
                                locale={locale}
                                onChange={(e) => { this.setState({ abiContent: e.json, isJsonCorrect: e.error }) }}
                                colors={{
                                    string: "#DAA520"
                                }}
                                height="300px"
                                width="100%"
                            />
                        </div>
                    </Form.Element>
                </Grid.Column>
            </Grid.Row>
        )

        const avalancheComponents = (
            <Grid.Row>
                <Grid.Column widthSM={Columns.Six}>
                    <Input
                        name="example"
                        placeholder="Example.."
                        onChange={() => { }}
                        value={"a"}
                    />
                </Grid.Column>
                <Grid.Column widthSM={Columns.Six}>
                    <Input
                        name="example"
                        placeholder="Example.."
                        onChange={() => { }}
                        value={"a"}
                    />
                </Grid.Column>
            </Grid.Row>
        )

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={600}>
                    <Overlay.Header
                        title="Register Smart Contract"
                        onDismiss={() => { dismissOverlay("visibleRegisterSC") }}
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

                            {selectedTab.id === "tron" && tronComponents}
                            {selectedTab.id === "avalanche" && avalancheComponents}


                            <Form.Footer>
                                <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                    onClick={() => { dismissOverlay("visibleRegisterSC") }}
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
        fetchAddSC: (payload) => dispatch(fetchAddSC(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterSC);