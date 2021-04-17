import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import users, { usersSaga } from "./users";
import chats, { chatsSaga } from "./chats";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ auth, users, chats });

export function* rootSaga() {
  yield all([authSaga(), usersSaga(), chatsSaga()]);
}

export default rootReducer;
