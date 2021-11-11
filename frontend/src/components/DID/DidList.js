// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    ResourceList, ConfirmationButton, Appearance, ResourceCard,
    Panel, ComponentSize, Grid, Columns, Form, Input, FlexBox, SlideToggle,
    Button, IconFont, ButtonType, ComponentColor, SelectDropdown, TextArea,
    ComponentStatus, QuestionMarkTooltip, InfluxColors, SquareButton, DapperScrollbars,
} from '@influxdata/clockface'

// Constants
import {
    tipStyle, personalInformation, addressesOfBCandSC,
} from '../../shared/constants/tips';

// Notifications
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchDidList } from "../../store/";

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

    contextMenu = (project) => {
        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <ConfirmationButton
                        icon={IconFont.Export}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { }}
                        text={""}
                        popoverColor={ComponentColor.Primary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Primary}
                        confirmationLabel="Do you want to export ?"
                        confirmationButtonColor={ComponentColor.Primary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Duplicate}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchCloneProject(project) }}
                        text={""}
                        popoverColor={ComponentColor.Secondary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Secondary}
                        confirmationLabel="Do you want to clone ?"
                        confirmationButtonColor={ComponentColor.Secondary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Trash}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchDeleteProject({ "id": project["_id"]["$oid"] }) }}
                        text={""}
                        popoverColor={ComponentColor.Danger}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Danger}
                        confirmationLabel="Do you want to delete ?"
                        confirmationButtonColor={ComponentColor.Danger}
                        confirmationButtonText="Yes"
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
                                        contextMenu={this.contextMenu("a")}
                                        margin={ComponentSize.Medium}
                                        style={{ paddingBottom: '20px', marginBottom: '5px' }}
                                    >
                                        <ResourceCard.EditableName
                                            onUpdate={this.handleUpdateScraperName}
                                            name={did.didName}
                                            noNameString={"default name"}
                                            buttonTestID="editable-name"
                                            inputTestID="input-field"
                                        />
                                        <ResourceCard.Meta>
                                            Did: {did.did}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DidList);