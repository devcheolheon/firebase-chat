import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import users, { usersSaga } from "./users";
import chats, { chatsSaga } from "./chats";
import messages, { messagesSaga } from "./messages";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ auth, users, chats, messages });

export function* rootSaga() {
  yield all([authSaga(), usersSaga(), chatsSaga(), messagesSaga()]);
}

export default rootReducer;
