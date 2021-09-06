// Libraries
import React, { Component } from 'react'

// Components
import { Page, Tabs } from '@influxdata/clockface'
import GenerateDID from "../../components/DID/GenerateDID";


class DID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                { id: "generate-did", text: 'Generate DID' }
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

                <Page.Contents fullWidth={false}>
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

                </Page.Contents>
            </Page>
        )
    }
}

export default DID;