// Libraries
import React, { Component } from 'react'
import { Router, Route, Switch } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';

// Helpers
import { history } from "./history";

// Layouts
import AuthLayout from './layouts/AuthLayout'
import UserLayout from './layouts/UserLayout';

// HOC
import PrivateRoute from "./router/PrivateRoute";

class App extends Component {
  render() {
    return (
      <>
        <NotificationContainer />
        <Router history={history}>
          <Switch>
            <Route exact path="/sign-in" component={AuthLayout} />
            <Route exact path="/sign-up" component={AuthLayout} />
            <PrivateRoute path="/" component={UserLayout} />
          </Switch>
        </Router>
      </>
    )
  }
}

export default App