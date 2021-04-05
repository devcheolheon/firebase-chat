import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/join" component={Join} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Router>
    );
  }
}
export default Routes;
