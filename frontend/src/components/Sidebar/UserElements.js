// Libraries
import React, { Component } from 'react';
import {
    Link,
} from 'react-router-dom'

// Components
import { TreeNav } from '@influxdata/clockface';


export default class UserElements extends Component {
    render() {
        return (
            <TreeNav.User username={"Username"} team={"Role"}>
                <TreeNav.UserItem
                    id="users"
                    label="My Projects"
                    linkElement={className => (
                        <Link className={className} to={"/my-projects"} />
                    )}
                />
                <TreeNav.UserItem
                    id="logout"
                    label="Logout"
                    linkElement={className => <Link className={className} to="/logout" />}
                />
            </TreeNav.User>
        )
    }
}
