// Libraries
import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Components
import {
    ComponentColor, IconFont, Button, ButtonType, FlexBox, ComponentSize,
} from '@influxdata/clockface'
import AddAction from "../../shared/overlays/AddAction";

class ActionTabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleAddAction: false,
        }
    }

    handleChangeAction = (index) => {
        console.log(index);
    }

    dismissOverlay = () => {
        this.setState({ visibleAddAction: false })
    }

    render() {
        const { visibleAddAction } = this.state;

        return (
            <>
                <AddAction visible={visibleAddAction} dismissOverlay={this.dismissOverlay} />

                <Tabs onSelect={index => this.handleChangeAction(index)}>
                    <TabList>
                        <Tab>Action 1</Tab>
                        <Tab>Action 2</Tab>
                        <Tab>Action 3</Tab>
                        <Tab>Action 4</Tab>
                        <Tab>Action 5</Tab>
                        <Tab>Action 6</Tab>
                        <Tab>Action 7</Tab>
                        <Tab>Action 8</Tab>

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

                    <TabPanel>
                        <h2>content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 2</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 3</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 4</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 5</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 6</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 7</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>content 8</h2>
                    </TabPanel>
                </Tabs>
            </>
        )
    }
}

export default ActionTabs;