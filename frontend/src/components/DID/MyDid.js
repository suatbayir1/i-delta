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
import { fetchDidList, fetchResolveDid, fetchDeleteDid } from "../../store/";

// Constants
import { resolveEbsiDidURl, } from "../../config";

// Helpers
import { mongoDateToString } from "../../helpers/DateOperations";

class MyDid extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    resolveDid = async (did) => {
        const { fetchResolveDid, } = this.props;

        await fetchResolveDid(`${resolveEbsiDidURl}/${did.did}`);
    }

    contextMenu = (did) => {
        const { fetchDeleteDid } = this.props;

        return (
            <>
                <FlexBox margin={ComponentSize.Small}>
                    <Button
                        icon={IconFont.Export}
                        size={ComponentSize.ExtraSmall}
                        text={"Resolve"}
                        color={ComponentColor.Primary}
                        onClick={() => { this.resolveDid(did) }}
                    />
                    <ConfirmationButton
                        icon={IconFont.Trash}
                        onConfirm={() => { fetchDeleteDid(did.did) }}
                        text="Delete"
                        popoverColor={ComponentColor.Danger}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Danger}
                        confirmationLabel="Do you want to delete your did ?"
                        confirmationButtonColor={ComponentColor.Danger}
                        confirmationButtonText="Yes"
                        size={ComponentSize.ExtraSmall}
                    />
                </FlexBox>
            </>
        )
    }

    render() {
        const { myDid } = this.props;

        return (
            <>
                <ResourceList>
                    <ResourceList.Body>
                        <ResourceCard
                            contextMenu={this.contextMenu(myDid)}
                            margin={ComponentSize.Medium}
                            style={{ paddingBottom: '20px', marginBottom: '5px' }}
                        >
                            <ResourceCard.EditableName
                                onUpdate={this.handleUpdateScraperName}
                                name={myDid.name}
                                noNameString={"default name"}
                                buttonTestID="editable-name"
                                inputTestID="input-field"
                            />
                            <ResourceCard.Meta>
                                {[
                                    <React.Fragment key={uuidv4()}>Did: {myDid.did}</React.Fragment>,
                                    <React.Fragment key={uuidv4()}>Email: {myDid.email}</React.Fragment>,
                                    <React.Fragment key={uuidv4()}>Created At: {mongoDateToString(myDid.createdAt)}</React.Fragment>,
                                ]}
                            </ResourceCard.Meta>
                        </ResourceCard>
                    </ResourceList.Body>
                </ResourceList>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dids: state.did.dids,
        user: state.auth.user,
        myDid: state.did.myDid,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDidList: () => dispatch(fetchDidList()),
        fetchResolveDid: (did, url) => dispatch(fetchResolveDid(did, url)),
        fetchDeleteDid: (did) => dispatch(fetchDeleteDid(did)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyDid);