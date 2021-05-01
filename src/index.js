import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "./theme";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";

import createSagaMiddleware from "redux-saga";

import rootReducer, { rootSaga } from "./module";

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  sagaMiddleware,
  process.env.NODE_ENV !== "production" && logger,
].filter(Boolean);

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
