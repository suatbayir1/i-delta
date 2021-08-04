// Libraries
import React, { Component } from 'react'

// Components
import {
    Form, Overlay, Grid, FlexBox, Columns, ComponentSize, Input, ComponentStatus,
} from '@influxdata/clockface'

class ClassDetail extends Component {
    render() {
        const { visible, dismissOverlay, selectedClass } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={600}>
                    <Overlay.Header
                        title="Smart Contract Detail"
                        onDismiss={() => { dismissOverlay("visibleClassDetailOverlay") }}
                    />

                    <Overlay.Body>
                        <Form>
                            <Grid.Row>
                                <Grid.Column widthSM={Columns.Six}>
                                    <FlexBox margin={ComponentSize.Small}>
                                        <Form.Element label="Name">
                                            <Input
                                                name="name"
                                                placeholder=""
                                                onChange={() => { }}
                                                value={selectedClass?.name}
                                                status={ComponentStatus.Disabled}
                                            />
                                        </Form.Element>
                                    </FlexBox>

                                </Grid.Column>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Property 1"
                                    >
                                        <Input
                                            name="prop1"
                                            placeholder=""
                                            onChange={() => { }}
                                            value={selectedClass?.prop1}
                                            status={ComponentStatus.Disabled}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                                <Grid.Column widthSM={Columns.Six}>
                                    <Form.Element
                                        label="Property 2"
                                    >
                                        <Input
                                            name="prop2"
                                            placeholder=""
                                            onChange={() => { }}
                                            status={ComponentStatus.Disabled}
                                            value={selectedClass?.prop2}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>
                        </Form>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay >
        )
    }
}

export default ClassDetail;