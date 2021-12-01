// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import { Page, Tabs } from '@influxdata/clockface'
import EditProfile from "../../components/Auth/EditProfile";
import ChangePassword from "../../components/Auth/ChangePassword";

// Helpers
import { isAuthorized } from "../../helpers/Authentication";

// Actions
import { fetchGetSingleDid, changeDidSelectedTab } from "../../store/";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                { id: "edit-profile", text: 'Edit Profile', component: EditProfile },
                { id: "change-password", text: 'Change Password', component: ChangePassword },
            ],
            selectedTab: { id: "edit-profile", text: 'Edit Profile', component: EditProfile }
        }
    }

    render() {
        const { tabs, selectedTab } = this.state;

        return (
            <Page>
                <Page.Header fullWidth={false}>
                    <Page.Title title="Profile" />
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

                    {/* DYNAMIC COMPONENT */}
                    <selectedTab.component />

                </Page.Contents>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);