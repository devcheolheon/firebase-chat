import { call, put, takeEvery } from "redux-saga/effects";
import { authLogin } from "../firebaseUtils/auth";
import { getUserNameById } from "../firebaseUtils/users";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const SET_USER = "SET_USER";
const UNSET_USER = "UNSET_USER";

export const login = ({ email, password }) => ({
  type: LOGIN,
  payload: { email, password },
});

export const logout = () => ({ type: LOGOUT });

export const setUser = ({ nickname, uid }) => ({
  type: SET_USER,
  payload: { uid, nickname, isLogin: true },
});

export const unSetUser = () => ({ type: UNSET_USER });

function* loginSaga(action) {
  try {
    const uid = yield call(authLogin, action.payload);
    if (uid == "") return;
    const nickname = yield call(getUserNameById, uid);
    yield put(setUser({ uid, nickname }));
  } catch (e) {
    yield put(unSetUser());
  }
}

export function* authSaga() {
  yield takeEvery(LOGIN, loginSaga);
}

const initialState = {
  isLogin: false,
  uid: "",
  nickname: "",
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        isLogin: true,
        ...action.payload,
      };
    case UNSET_USER:
      return initialState;
    default:
      return state;
  }
}
