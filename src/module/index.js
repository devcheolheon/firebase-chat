import { combineReducers } from "redux";
import auth, { authSaga } from "./auth";
import users, { usersSaga } from "./users";
import { all } from "redux-saga/effects";

const rootReducer = combineReducers({ auth, users });

export function* rootSaga() {
  yield all([authSaga(), usersSaga()]);
}

export default rootReducer;
