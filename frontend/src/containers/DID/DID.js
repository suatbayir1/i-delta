// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import { Page, Tabs } from '@influxdata/clockface'
import GenerateDID from "../../components/DID/GenerateDID";
import DidList from "../../components/DID/DidList";
import MyDid from "../../components/DID/MyDid";

// Helpers
import { isAuthorized } from "../../helpers/Authentication";

// Actions
import { fetchGetSingleDid, changeDidSelectedTab } from "../../store/";

class DID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                { id: "generate-did", text: 'Generate DID', requiredRole: ["member", "admin"] },
                { id: "my-did", text: 'My DID', requiredRole: ["member", "admin"] },
                { id: "did-list", text: 'DID List', requiredRole: ["admin"] }
            ],
        }
    }

    async componentDidMount() {
        const { fetchGetSingleDid, user, changeDidSelectedTab } = this.props;

        await fetchGetSingleDid(user["_id"]["$oid"]);
        await changeDidSelectedTab("generate-did");
    }

    isVisible = (tab) => {
        const { myDid } = this.props;

        switch (tab) {
            case "my-did":
                return Object.keys(myDid).length > 0 ? true : false
            default: return true
        }
    }

    change = async (tab) => {
        const { changeDidSelectedTab } = this.props;

        await changeDidSelectedTab(tab);
    }

    render() {
        const { tabs } = this.state;
        const { selectedDidTab } = this.props;

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
                                        isAuthorized(tab.requiredRole) &&
                                        this.isVisible(tab.id) &&
                                        <Tabs.Tab
                                            key={tab.id}
                                            text={tab.text}
                                            onClick={() => { this.change(tab.id) }}
                                            active={tab.id === selectedDidTab}
                                        />
                                    )
                                })
                            }
                        </Tabs>
                    </Tabs.Container>


                    {selectedDidTab === "generate-did" && <GenerateDID />}
                    {selectedDidTab === "my-did" && <MyDid />}
                    {selectedDidTab === "did-list" && <DidList />}

                </Page.Contents>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        myDid: state.did.myDid,
        selectedDidTab: state.did.selectedDidTab
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGetSingleDid: (payload) => dispatch(fetchGetSingleDid(payload)),
        changeDidSelectedTab: (payload) => dispatch(changeDidSelectedTab(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DID);