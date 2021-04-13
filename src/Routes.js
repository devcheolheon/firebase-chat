import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Chatting from "./pages/Chatting";

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/join" component={Join} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/chatting" component={Chatting} />
        </Switch>
      </Router>
    );
  }
}
export default Routes;
