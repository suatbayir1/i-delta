// Libraries
import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from "react-redux";

// Components
import {
    ComponentColor, IconFont, Button, ButtonType, FlexBox, ComponentSize,
} from '@influxdata/clockface'
import AddAction from "../../shared/overlays/AddAction";

// Actions
import { setSelectedAction } from "../../store/"


class ActionTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleAddAction: false,
            selectedIndex: 0,
        }
    }

    componentDidUpdate = async (prevProps) => {
        const { actions, setSelectedAction, selectedProject } = this.props;
        const { selectedIndex } = this.state;

        if (prevProps.selectedProject !== selectedProject) {
            await setSelectedAction(actions[0]);
        }

        if (prevProps.actions !== actions) {
            await setSelectedAction(actions[selectedIndex]);
        }
    }

    handleChangeAction = async (index) => {
        const { actions, setSelectedAction } = this.props;
        this.setState({ selectedIndex: index });
        await setSelectedAction(actions[index]);
    }

    dismissOverlay = () => {
        this.setState({ visibleAddAction: false })
    }

    render() {
        const { visibleAddAction } = this.state;
        const { actions } = this.props;

        return (
            <>
                <AddAction visible={visibleAddAction} dismissOverlay={this.dismissOverlay} />

                <Tabs onSelect={index => this.handleChangeAction(index)}>
                    <TabList>
                        {
                            actions.map((action, idx) => {
                                return (
                                    <Tab
                                        key={idx}
                                        style={{ width: '100px', borderRight: '2px solid #aaa' }}
                                    >
                                        {action.actionName}
                                    </Tab>
                                )
                            })
                        }
                        <Button
                            style={{ marginLeft: '10px' }}
                            size={ComponentSize.Small}
                            text=""
                            icon={IconFont.Plus}
                            type={ButtonType.Button}
                            color={ComponentColor.Primary}
                            onClick={() => { this.setState({ visibleAddAction: true }) }}
                        />
                    </TabList>

                    {
                        actions.map((action, idx) => {
                            return (
                                <TabPanel key={idx}>
                                </TabPanel>)
                        })
                    }
                </Tabs>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        actions: state.action.actions,
        selectedProject: state.project.selectedProject
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedAction: (payload) => dispatch(setSelectedAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionTabs);