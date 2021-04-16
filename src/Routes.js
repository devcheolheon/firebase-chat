import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useSyncLoginStatus from "./hooks/useSyncLoginStatus";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Main from "./pages/Main";

const Routes = () => {
  useSyncLoginStatus();
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/join" component={Join} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/main" component={Main} />
      </Switch>
    </Router>
  );
};
export default Routes;
