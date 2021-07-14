// Libraries
import React, { Component } from 'react'

// Components
import {
    Form, Button, ButtonType, ComponentColor, Overlay, IconFont, Grid,
    FlexBox, Columns, ComponentSize, SelectDropdown, QuestionMarkTooltip,
    InfluxColors, Input,
} from '@influxdata/clockface'

// Notification
import { NotificationManager } from 'react-notifications';

// Constants
import {
    tipStyle, example
} from '../constants/tips';


class RegisterSC extends Component {
    save = () => {
        NotificationManager.warning('Save method will be create', 'TODO', 3000)
    }

    render() {
        const { visible, dismissOverlay } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={600}>
                    <Overlay.Header
                        title="Register Smart Contract"
                        onDismiss={() => { dismissOverlay("visibleRegisterSC") }}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Six}>
                                    <FlexBox margin={ComponentSize.Small}>
                                        <Form.Element label="Parent">
                                            <SelectDropdown
                                                options={["one", "two"]}
                                                selectedOption={"one"}
                                                onSelect={(e) => { }}
                                            />
                                        </Form.Element>

                                        <QuestionMarkTooltip
                                            style={{ marginTop: '7px' }}
                                            diameter={20}
                                            tooltipStyle={{ width: '400px' }}
                                            color={ComponentColor.Secondary}
                                            tooltipContents={<div style={{ whiteSpace: 'pre-wrap', fontSize: "13px" }}>
                                                <div style={{ color: InfluxColors.Star }}>{"Example:"}
                                                    <hr style={tipStyle} />
                                                </div>
                                                {example}
                                            </div>}
                                        />
                                    </FlexBox>

                                </Grid.Column>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Example"
                                        required={true}
                                    >
                                        <Input
                                            name="example"
                                            placeholder="Example.."
                                            onChange={() => { }}
                                            value={"a"}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

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

export default RegisterSC;