// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Components
import {
    ResourceList, ConfirmationButton, Appearance, ResourceCard, ComponentSize,
    FlexBox, IconFont, ComponentColor, Button,
} from '@influxdata/clockface'

// Actions
import { fetchDidList, fetchResolveDid } from "../../store/";

// Constants
import { resolveEbsiDidURl } from "../../config";

// Helpers
import { mongoDateToString } from "../../helpers/DateOperations";

class DidList extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    async componentDidMount() {
        const { fetchDidList } = this.props;

        await fetchDidList();
    }

    resolveDid = async (did) => {
        const { fetchResolveDid } = this.props;

        await fetchResolveDid(`${resolveEbsiDidURl}/${did.did}`);
    }

    contextMenu = (did) => {
        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <Button
                        icon={IconFont.Export}
                        size={ComponentSize.ExtraSmall}
                        text={"Resolve"}
                        color={ComponentColor.Primary}
                        onClick={() => { this.resolveDid(did) }}
                    />
                </FlexBox>
            </>
        )
    }

    render() {
        const { dids } = this.props;

        return (
            <>
                <ResourceList>
                    <ResourceList.Body>
                        {
                            dids.map((did, idx) => {
                                return (
                                    <ResourceCard
                                        key={idx}
                                        contextMenu={this.contextMenu(did)}
                                        margin={ComponentSize.Medium}
                                        style={{ paddingBottom: '20px', marginBottom: '5px' }}
                                    >
                                        <ResourceCard.EditableName
                                            onUpdate={this.handleUpdateScraperName}
                                            name={did.name}
                                            noNameString={"default name"}
                                            buttonTestID="editable-name"
                                            inputTestID="input-field"
                                        />
                                        <ResourceCard.Meta>
                                            {[
                                                <React.Fragment key={uuidv4()}>Did: {did.did}</React.Fragment>,
                                                <React.Fragment key={uuidv4()}>Email: {did.email}</React.Fragment>,
                                                <React.Fragment key={uuidv4()}>Created At: {mongoDateToString(did.createdAt)}</React.Fragment>,
                                            ]}
                                        </ResourceCard.Meta>
                                    </ResourceCard>
                                )
                            })
                        }
                    </ResourceList.Body>
                </ResourceList>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dids: state.did.dids
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDidList: () => dispatch(fetchDidList()),
        fetchResolveDid: (did, url) => dispatch(fetchResolveDid(did, url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DidList);