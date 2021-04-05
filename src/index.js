import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes.js";
import "./bootstrap/bootstrap.min.css";
import "./bootstrap/root.css";

ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById("root")
);
