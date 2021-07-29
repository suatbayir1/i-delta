// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Overlay, Form, Columns, Grid, Input, MultiSelectDropdown, Dropdown,
    Button, IconFont, ComponentColor, ButtonType, SelectDropdown, TextArea,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Utilities
import { history } from "../../history";

// Actions
import { fetchAddTransaction } from "../../store"

class AddTransaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [
                { id: "classA", name: "Class A", prop1: 'prop1', prop2: 'prop2' },
                { id: "classB", name: "Class B", prop1: 'prop1', prop2: 'prop2' },
                { id: "classC", name: "Class C", prop1: 'prop1', prop2: 'prop2' },
                { id: "classD", name: "Class D", prop1: 'prop1', prop2: 'prop2' },
                { id: "classE", name: "Class E", prop1: 'prop1', prop2: 'prop2' },
                { id: "classF", name: "Class F", prop1: 'prop1', prop2: 'prop2' },
                { id: "classG", name: "Class G", prop1: 'prop1', prop2: 'prop2' },
            ],
            source: {},
            target: {},
            transactionMessage: "",
        }
    }

    handleValiation = () => {
        const { source, target, transactionMessage } = this.state;

        if (Object.keys(source).length === 0 || Object.keys(target).length === 0 || transactionMessage === "") {
            NotificationManager.error('Source, target and transaction could not be empty', 'Error', 3000);
            return false;
        }

        if (source === target) {
            NotificationManager.error('Source and target could not be same', 'Error', 3000);
            return false;
        }

        return true;
    }

    addTransaction = async () => {
        const { source, target, transactionMessage } = this.state;
        const { selectedAction, fetchAddTransaction } = this.props;

        console.log("selectedAction", selectedAction);

        if (this.handleValiation()) {
            const payload = {
                "actionID": selectedAction["_id"]["$oid"],
                "projectID": selectedAction["projectID"],
                source,
                target,
                transactionMessage
            }

            await fetchAddTransaction(payload);
        }
    }

    render() {
        const { classes, source, target, transactionMessage } = this.state;
        const { visible, dismissOverlay } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={600}>
                    <Overlay.Header
                        title="Add New Transaction"
                        onDismiss={() => { dismissOverlay("visibleAddTransaction") }}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Source"
                                        required={true}
                                    >
                                        <Dropdown
                                            button={(active, onClick) => (
                                                <Dropdown.Button
                                                    active={active}
                                                    onClick={onClick}
                                                    color={ComponentColor.Default}
                                                >
                                                    {source.name === undefined
                                                        ? "Select source"
                                                        : source?.name}
                                                </Dropdown.Button>
                                            )}
                                            menu={onCollapse => (
                                                <Dropdown.Menu
                                                    onCollapse={onCollapse}
                                                >
                                                    {
                                                        classes.map(item => {
                                                            return (
                                                                <Dropdown.Item
                                                                    id={item['id']}
                                                                    key={item['id']}
                                                                    value={item}
                                                                    onClick={(e) => { this.setState({ source: e }) }}
                                                                >
                                                                    {item['name']}
                                                                </Dropdown.Item>
                                                            )
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            )}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Target"
                                        required={true}
                                    >
                                        <Dropdown
                                            button={(active, onClick) => (
                                                <Dropdown.Button
                                                    active={active}
                                                    onClick={onClick}
                                                    color={ComponentColor.Default}
                                                >
                                                    {target.name === undefined
                                                        ? "Select target"
                                                        : target?.name}
                                                </Dropdown.Button>
                                            )}
                                            menu={onCollapse => (
                                                <Dropdown.Menu
                                                    onCollapse={onCollapse}
                                                >
                                                    {
                                                        classes.map(item => {
                                                            return (
                                                                <Dropdown.Item
                                                                    id={item['id']}
                                                                    key={item['id']}
                                                                    value={item}
                                                                    onClick={(e) => { this.setState({ target: e }) }}
                                                                >
                                                                    {item['name']}
                                                                </Dropdown.Item>
                                                            )
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            )}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthSM={Columns.Twelve}>
                                    <Form.Element
                                        label="Transaction Message"
                                        required={true}
                                    >
                                        <TextArea
                                            name="transactionMessage"
                                            value={transactionMessage}
                                            placeholder="Transaction Message.."
                                            onChange={(e) => { this.setState({ transactionMessage: e.target.value }) }}
                                            rows={5}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Form.Footer>
                                <Button
                                    text="Cancel"
                                    icon={IconFont.Remove}
                                    onClick={() => { dismissOverlay("visibleAddTransaction") }}
                                />

                                <Button
                                    text="Save"
                                    icon={IconFont.Checkmark}
                                    color={ComponentColor.Success}
                                    type={ButtonType.Submit}
                                    onClick={this.addTransaction}
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
        selectedAction: state.action.selectedAction
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAddTransaction: (payload) => dispatch(fetchAddTransaction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);