import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import users, { usersSaga } from "./users";
import chats, { chatsSaga } from "./chats";
import messages, { messagesSaga } from "./messages";
import init, { initSaga } from "./init";

import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ auth, users, chats, messages, init });

export function* rootSaga() {
  yield all([authSaga(), usersSaga(), chatsSaga(), messagesSaga(), initSaga()]);
}

export default rootReducer;
