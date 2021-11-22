// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

// Components
import {
    Overlay, Form, Columns, Grid,
    Button, IconFont, ComponentColor, ButtonType,
} from '@influxdata/clockface'

// Helpers
import { exportJSON } from "../../helpers/FileExport";

// Actions
import { clearKeyPair } from "../../store"

class DownloadKeyPair extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { visible, clearKeyPair, keyPair } = this.props;

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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearKeyPair: () => dispatch(clearKeyPair()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadKeyPair);