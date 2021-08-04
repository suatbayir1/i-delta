// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns, ConfirmationButton,
    ComponentColor, IconFont, Button, ButtonType, Appearance,
} from '@influxdata/clockface'

// Overlays
import RegisterBC from "../../shared/overlays/RegisterBC";
import RegisterSC from "../../shared/overlays/RegisterSC";
import RegisterWallet from "../../shared/overlays/RegisterWallet";
import AddTransaction from "../../shared/overlays/AddTransaction";

// Notifications
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchDeleteAction, fetchDeleteTransaction } from "../../store/";

class LeftSideOperations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleRegisterBC: false,
            visibleRegisterSC: false,
            visibleRegisterWallet: false,
            visibleAddTransaction: false,
        }
    }

    handleDeleteAction = async () => {
        const { selectedAction, fetchDeleteAction } = this.props;

        if (selectedAction === undefined) {
            NotificationManager.error('Please select a action first', 'Error', 3000);
            return;
        }

        await fetchDeleteAction(selectedAction);
    }

    dismissOverlay = (state) => {
        this.setState({ [state]: false })
    }

    todo = () => {
        NotificationManager.warning('This method will be developed', 'TODO', 3000);
    }

    openAddTransactionOverlay = () => {
        const { selectedAction } = this.props;

        if (selectedAction === undefined) {
            NotificationManager.warning("Please select an action first", "Warning", 3000);
            return;
        }

        this.setState({ visibleAddTransaction: true })
    }

    render() {
        const { visibleRegisterBC, visibleRegisterSC, visibleRegisterWallet, visibleAddTransaction } = this.state;

        return (
            <>
                <RegisterBC visible={visibleRegisterBC} dismissOverlay={this.dismissOverlay} />
                <RegisterSC visible={visibleRegisterSC} dismissOverlay={this.dismissOverlay} />
                <RegisterWallet visible={visibleRegisterWallet} dismissOverlay={this.dismissOverlay} />
                <AddTransaction visible={visibleAddTransaction} dismissOverlay={this.dismissOverlay} />

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
                                            onClick={() => { this.openAddTransactionOverlay() }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element label="">
                                        <ConfirmationButton
                                            icon={IconFont.Remove}
                                            size={ComponentSize.Small}
                                            onConfirm={this.handleDeleteAction}
                                            text="Delete Action"
                                            popoverColor={ComponentColor.Danger}
                                            popoverAppearance={Appearance.Outline}
                                            color={ComponentColor.Danger}
                                            confirmationLabel="Do you want to delete ?"
                                            confirmationButtonColor={ComponentColor.Danger}
                                            confirmationButtonText="Yes"
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

const mapStateToProps = (state) => {
    return {
        selectedAction: state.action.selectedAction
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDeleteAction: (payload) => dispatch(fetchDeleteAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideOperations);