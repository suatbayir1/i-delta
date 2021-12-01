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
import { clearResolvedDid } from "../../store"

class ResolvedDid extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { visible, clearResolvedDid, resolvedDid } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={700}>
                    <Overlay.Header
                        title="Did Document"
                        onDismiss={() => { clearResolvedDid() }}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Twelve}>
                                    <Form.Element
                                        label="Resolved Did"
                                    >
                                        <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                                            <JSONInput
                                                placeholder={resolvedDid}
                                                viewOnly={true}
                                                theme="dark_vscode_tribute"
                                                locale={locale}
                                                colors={{
                                                    string: "#DAA520"
                                                }}
                                                height="350px"
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
                                    onClick={() => { exportJSON("did-document", resolvedDid) }}
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
        visible: state.did.isResolvedDidVisible,
        resolvedDid: state.did.resolvedDid,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearResolvedDid: () => dispatch(clearResolvedDid()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResolvedDid);