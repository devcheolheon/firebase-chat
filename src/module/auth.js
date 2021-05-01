import { call, put, takeEvery } from "redux-saga/effects";
import { authLogin, authLogout } from "../firebaseUtils/auth";
import { getUserNameById } from "../firebaseUtils/users";

const INIT = "auth/INIT";
// firebase 의 인증상태 변화를 구독하다가 로그인으로 상태가 변경되었을 떄 발생되는 액션
// uid 로 로그인 한 사용자의 정보를 조회한 뒤 세팅한다

// ( 로그아웃 api를 호출하지 않는 한 로그인 상태가 유지된다 )
// 동일 브라우져로 재접속하거나 새로고침할 경우 발생

const LOGIN = "auth/LOGIN";
// 사용자가 직접 아이디 비밀번호를 입력해서 로그인할떄 발생하는 액션

const LOGOUT = "auth/LOGOUT";

const SET_USER = "auth/SET_USER";
const UNSET_USER = "auth/UNSET_USER";
// 현재 로그인한 유져의 정보를 SET하거나 UNSET하는 액션

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
        loading: false,
        ...action.payload,
      };
    case UNSET_USER:
      return initialState;
    default:
      return state;
  }
}
