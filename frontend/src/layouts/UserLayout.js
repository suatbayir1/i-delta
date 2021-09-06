// Libraries
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

// Helpers
import { history } from "../history";

// Components
import { AppWrapper } from '@influxdata/clockface'
import Project from '../containers/Projects/Project';
import ExamplePage from '../containers/Home/ExamplePage';
import Sidebar from "../shared/components/Sidebar"
import Logout from '../components/Auth/Logout';
import Projects from '../containers/Projects/Projects';
import AddProject from "../shared/overlays/AddProject";
import DID from "../containers/DID/DID";

class UserLayout extends Component {
    render() {
        return (
            <>
                <AppWrapper>
                    <Sidebar />

                    <Router history={history}>
                        <Switch>
                            <Route exact path="/example" component={ExamplePage} />
                            <Route exact path="/logout" component={Logout} />
                            <Route exact path="/my-projects" component={Projects} />
                            <Route exact path="/add-project" component={AddProject} />
                            <Route exact path="/project/:id" component={Project} />
                            <Route exact path="/did" component={DID} />
                            <Route exact path="/" component={ExamplePage} />
                        </Switch>
                    </Router>
                </AppWrapper>
            </>
        )
    }
}

export default UserLayout;