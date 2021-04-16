import { call, put, takeEvery } from "redux-saga/effects";
import { authLogin, authLogout } from "../firebaseUtils/auth";
import { getUserNameById } from "../firebaseUtils/users";

const INIT = "auth/INIT";
const LOGIN = "auth/LOGIN";
const LOGOUT = "auth/LOGOUT";
const SET_USER = "auth/SET_USER";
const UNSET_USER = "auth/UNSET_USER";

export const init = (uid) => ({ type: INIT, payload: uid });

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

function* initSaga(action) {
  try {
    const uid = action.payload;
    if (uid != "") {
      const nickname = yield call(getUserNameById, uid);
      yield put(setUser({ uid, nickname }));
    } else {
      yield put(unSetUser());
    }
  } catch (e) {
    yield put(unSetUser());
  }
}

function* loginSaga(action) {
  let uid = yield call(authLogin, action.payload);
  if (uid === "") {
    yield put(unSetUser());
  } else {
    const nickname = yield call(getUserNameById, uid);
    yield put(setUser({ uid, nickname }));
  }
}

function* logoutSaga(action) {
  yield put(unSetUser());
  try {
    yield call(authLogout);
  } catch (e) {}
}

export function* authSaga() {
  yield takeEvery(INIT, initSaga);
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(LOGOUT, logoutSaga);
}

const initialState = {
  loading: true,
  isLogin: false,
  uid: "",
  nickname: "",
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGOUT:
      return {
        ...state,
        isLogin: false,
      };
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
