import { takeEvery, put, select } from "redux-saga/effects";
import { getChatsSaga, linkToChats } from "../module/chats";
import { getUsersSaga, linkToUsers } from "../module/users";
import {
  getMessages,
  getMessagesSaga,
  initLinkToChatMessagesSaga,
} from "../module/messages";
// 최초 어플리케이션 진입시 초기화 과정을 진행하고 그 상태를 표시하기 위한 모듈

const SET_LOADING = "init/SET_LOADING";
const UNSET_LOADING = "init/UNSET_LOADING";
// 초기화 과정이 진행중이거나 끝났을떄 발생하는 액션

const INIT = "init/INIT";
const LINK = "init/LINK";

const setloading = () => ({ type: SET_LOADING });
const unsetloading = () => ({ type: UNSET_LOADING });

export const startInit = (payload) => ({ type: INIT, payload });

const initialState = {
  loading: true,
};
// 최초 초기화 가 필요하므로..loading 값을 true로 준다

export function* initDataSaga(action) {
  yield put(setloading());
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
}

export default function init(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { loading: true };
    case UNSET_LOADING:
      return { loading: false, init: true };
    default:
      return state;
  }
}
