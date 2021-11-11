// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

// Components
import {
    Overlay, Form, Columns, Grid, Input, MultiSelectDropdown, Dropdown,
    Button, IconFont, ComponentColor, ButtonType, SelectDropdown, TextArea,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Utilities
import { history } from "../../history";

// Helpers
import { exportJSON } from "../../helpers/FileExport";

// Actions
import { clearKeyPair } from "../../store"

class DownloadKeyPair extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // classes: [
            //     { id: "classA", name: "Class A", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classB", name: "Class B", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classC", name: "Class C", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classD", name: "Class D", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classE", name: "Class E", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classF", name: "Class F", prop1: 'prop1', prop2: 'prop2' },
            //     { id: "classG", name: "Class G", prop1: 'prop1', prop2: 'prop2' },
            // ],
            // source: {},
            // target: {},
            // transactionMessage: "",
        }
    }

    // handleValiation = () => {
    //     const { source, target, transactionMessage } = this.state;

    //     if (Object.keys(source).length === 0 || Object.keys(target).length === 0 || transactionMessage === "") {
    //         NotificationManager.error('Source, target and transaction could not be empty', 'Error', 3000);
    //         return false;
    //     }

    //     if (source === target) {
    //         NotificationManager.error('Source and target could not be same', 'Error', 3000);
    //         return false;
    //     }

    //     return true;
    // }

    // addTransaction = async () => {
    //     const { source, target, transactionMessage } = this.state;
    //     const { selectedAction, fetchAddTransaction } = this.props;

    //     console.log("selectedAction", selectedAction);

    //     if (this.handleValiation()) {
    //         const payload = {
    //             "actionID": selectedAction["_id"]["$oid"],
    //             "projectID": selectedAction["projectID"],
    //             source,
    //             target,
    //             transactionMessage
    //         }

    //         await fetchAddTransaction(payload);
    //     }
    // }

    render() {
        // const { classes, source, target, transactionMessage } = this.state;
        const { visible, clearKeyPair, keyPair } = this.props;

        console.log("keyPair", keyPair);

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={700}>
                    <Overlay.Header
                        title="Download & Keep Your Keys"
                        onDismiss={() => { clearKeyPair() }}
                    />

                    <Overlay.Body>
                        <p>Please keep your private key in a safe place and do not share it with anyone.</p>

                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Twelve}>
                                    <Form.Element
                                        label="Your Keys"
                                        required={true}
                                    >
                                        <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                                            <JSONInput
                                                placeholder={keyPair} // data to display
                                                theme="dark_vscode_tribute"
                                                locale={locale}
                                                // onChange={(e) => { this.setState({ abiContent: e.json, isJsonCorrect: e.error }) }}
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

                            <Form.Footer>
                                {/* <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                // onClick={() => { dismissOverlay("visibleAddTransaction") }}
                                /> */}

                                <Button
                                    text="Download"
                                    icon={IconFont.Download}
                                    color={ComponentColor.Primary}
                                    type={ButtonType.Submit}
                                    onClick={() => { exportJSON("key-pair", keyPair) }}
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
        visible: state.did.isTheKeyDownloadable,
        keyPair: state.did.keyPair,
        // selectedAction: state.action.selectedAction
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearKeyPair: () => dispatch(clearKeyPair()),
        // fetchAddTransaction: (payload) => dispatch(fetchAddTransaction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadKeyPair);