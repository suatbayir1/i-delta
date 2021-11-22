// Libraries
import React, { Component } from 'react'

// Components
import {
    Button, ComponentColor, ButtonGroup, Orientation
} from '@influxdata/clockface'


class DidTypeListButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            didTypes: ["did:ebsi", "did:ethr", "did:sov", "did:indy"],
        }
    }


    render() {
        const { didTypes } = this.state;
        const { handleChooseDidType, selectedDidType } = this.props;

        return (
            <ButtonGroup orientation={Orientation.Horizontal}>
                {
                    didTypes.map((type, idx) => {
                        return (
                            <Button
                                key={idx}
                                text={type}
                                color={
                                    selectedDidType === type
                                        ? ComponentColor.Success
                                        : ComponentColor.Default
                                }
                                onClick={() => { handleChooseDidType(type) }}
                            />
                        )
                    })
                }
            </ButtonGroup>

        )
    }
}

export default DidTypeListButtons;