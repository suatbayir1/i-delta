// Libraries
import React, { Component } from 'react'

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns,
    ComponentColor, IconFont, Button, ButtonType,
} from '@influxdata/clockface'

// Overlays
import RegisterBC from "../../shared/overlays/RegisterBC";
import RegisterSC from "../../shared/overlays/RegisterSC";
import RegisterWallet from "../../shared/overlays/RegisterWallet";

// Notifications
import { NotificationManager } from 'react-notifications';

class LeftSideOperations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleRegisterBC: false,
            visibleRegisterSC: false,
            visibleRegisterWallet: false,
        }
    }

    dismissOverlay = (state) => {
        this.setState({ [state]: false })
    }

    todo = () => {
        NotificationManager.warning('This method will be developed', 'TODO', 3000);
    }

    render() {
        const { visibleRegisterBC, visibleRegisterSC, visibleRegisterWallet } = this.state;

        return (
            <>
                <RegisterBC visible={visibleRegisterBC} dismissOverlay={this.dismissOverlay} />
                <RegisterSC visible={visibleRegisterSC} dismissOverlay={this.dismissOverlay} />
                <RegisterWallet visible={visibleRegisterWallet} dismissOverlay={this.dismissOverlay} />

                <Panel>
                    <Panel.Header size={ComponentSize.ExtraSmall}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element label="">
                                        <Button
                                            text="Open"
                                            icon={IconFont.Checkmark}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Success}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element label="">
                                        <Button
                                            text="Close"
                                            icon={IconFont.Remove}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Secondary}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element label="">
                                        <Button
                                            text="Clone"
                                            icon={IconFont.Duplicate}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Primary}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element label="">
                                        <Button
                                            text="Delete"
                                            icon={IconFont.Trash}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Danger}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Panel.Header>
                </Panel>

                <Panel style={{ marginTop: '20px' }}>
                    <Panel.Header size={ComponentSize.ExtraSmall}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <Button
                                            text="Register BC"
                                            icon={IconFont.Checkmark}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Success}
                                            onClick={() => { this.setState({ visibleRegisterBC: true }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <Button
                                            text="Register SC"
                                            icon={IconFont.Checkmark}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Primary}
                                            onClick={() => { this.setState({ visibleRegisterSC: true }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <Button
                                            text="Register Wallet"
                                            icon={IconFont.Checkmark}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Secondary}
                                            onClick={() => { this.setState({ visibleRegisterWallet: true }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Panel.Header>
                </Panel>

                <Panel style={{ marginTop: '20px' }}>
                    <Panel.Header size={ComponentSize.ExtraSmall}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <Button
                                            text="Add Transaction"
                                            icon={IconFont.Plus}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Success}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <Button
                                            text="Delete Transaction"
                                            icon={IconFont.Trash}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Danger}
                                            onClick={this.todo}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Panel.Header>
                </Panel>
            </>
        )
    }
}

export default LeftSideOperations;