// Libraries
import React, { Component } from 'react'

// Components
import { Page, Tabs } from '@influxdata/clockface'
import GenerateDID from "../../components/DID/GenerateDID";
import DidList from "../../components/DID/DidList";

class DID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                { id: "generate-did", text: 'Generate DID' },
                { id: "did-list", text: 'DID List' }
            ],
            selectedTab: { id: "generate-did", text: 'Generate DID' }
        }
    }

    render() {
        const { tabs, selectedTab } = this.state;

        return (
            <Page>
                <Page.Header fullWidth={false}>
                    <Page.Title title="DID Manager" />
                </Page.Header>

                <Page.Contents fullWidth={false} scrollable={true}>
                    <Tabs.Container style={{ marginBottom: '20px' }}>
                        <Tabs>
                            {
                                tabs.map(tab => {
                                    return (
                                        <Tabs.Tab
                                            key={tab.id}
                                            text={tab.text}
                                            onClick={() => { this.setState({ selectedTab: tab }) }}
                                            active={tab.id === selectedTab.id}
                                        />
                                    )
                                })
                            }
                        </Tabs>
                    </Tabs.Container>


                    {selectedTab.id === "generate-did" && <GenerateDID />}
                    {selectedTab.id === "did-list" && <DidList />}

                </Page.Contents>
            </Page>
        )
    }
}

export default DID;