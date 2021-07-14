// Libraries
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

// Helpers
import { history } from "../history";

// Components
import { AppWrapper } from '@influxdata/clockface'
import HomePage from '../containers/Home/HomePage';
import ExamplePage from '../containers/Home/ExamplePage';
import Sidebar from "../shared/components/Sidebar"
import Logout from '../components/Auth/Logout';

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
                            <Route exact path="/" component={HomePage} />
                        </Switch>
                    </Router>
                </AppWrapper>
            </>
        )
    }
}

export default UserLayout;