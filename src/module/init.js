import { takeEvery, put, select } from "redux-saga/effects";
import {
  closeAllLinkToChats,
  getChatsSaga,
  linkToChats,
} from "../module/chats";
import {
  closeAllLinkToUsers,
  getUsersSaga,
  linkToUsers,
} from "../module/users";
import {
  closeLinkToAllChatMessages,
  getMessages,
  getMessagesSaga,
  initLinkToChatMessagesSaga,
} from "../module/messages";
// 최초 어플리케이션 진입시 초기화 과정을 진행하고 그 상태를 표시하기 위한 모듈

const SET_LOADING = "init/SET_LOADING";
const UNSET_LOADING = "init/UNSET_LOADING";
// 초기화 과정이 진행중이거나 끝났을떄 발생하는 액션

const SET_INIT_FALSE = "init/SET_INIT_FALSE";
const SET_INIT_TRUE = "init/SET_INIT_TRUE";
// 로그아웃시 진행되어야할 과정이 끝났을때 발생하는 액션

const INIT = "init/INIT";
const UN_INIT = "init/UNINIT";
const LINK = "init/LINK";

const setloading = () => ({ type: SET_LOADING });
const unsetloading = () => ({ type: UNSET_LOADING });

const setInitFalse = () => ({ type: SET_INIT_FALSE });
const setInitTrue = () => ({ type: SET_INIT_TRUE });

export const startInit = (payload) => ({ type: INIT, payload });
export const startUnInit = () => ({ type: UN_INIT });

const initialState = {
  loading: false,
};

export function* initDataSaga(action) {
  yield put(setloading());
  yield put(setInitTrue());
  yield getChatsSaga();
  yield getUsersSaga();
  let chats = yield select(
    (state) => state.users[action.payload.uid].chats || []
  );
  let uid = yield select((state) => state.auth.uid);
  for (let chatId of chats) {
    yield getMessagesSaga(getMessages({ chat: chatId, uid }));
  }
  yield put(unsetloading());
  yield linkDataSaga();
}

export function* unInitDataSaga() {
  yield put(setloading());
  yield unLinkDataSaga();
  yield put(setInitFalse());
  yield put(unsetloading());
}

// unLinkDataSaga

// chats , users, messages 컬렉션을 구독하던 채널을 종료하는 액션을
// 발생시킨다

export function* unLinkDataSaga() {
  yield put(closeAllLinkToUsers());
  yield put(closeAllLinkToChats());
  yield put(closeLinkToAllChatMessages());
}

// linkDataSaga

// chats , users 컬렉션의 변경사항을 구독하도록 한다.
// 입장한 채팅방이 있을 경우 해당 채팅방의 메시지 컬렉션들도 구독한다.

export function* linkDataSaga() {
  yield put(linkToChats());
  yield put(linkToUsers());
  yield initLinkToChatMessagesSaga();
}

export function* initSaga() {
  yield takeEvery(INIT, initDataSaga);
  yield takeEvery(UN_INIT, unInitDataSaga);
}

export default function init(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: true };
    case UNSET_LOADING:
      return { ...state, loading: false };
    case SET_INIT_FALSE:
      return { ...state, init: false };
    case SET_INIT_TRUE:
      return { ...state, init: true };
    default:
      return state;
  }
}
