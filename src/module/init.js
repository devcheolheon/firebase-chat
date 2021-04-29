import { takeEvery, put, select } from "redux-saga/effects";
import { getChatsSaga, linkToChats } from "../module/chats";
import { getUsersSaga, linkToUsers } from "../module/users";
import {
  getMessages,
  getMessagesSaga,
  initLinkToChatMessagesSaga,
} from "../module/messages";

const SET_LOADING = "init/SET_LOADING";
const UNSET_LOADING = "init/UNSET_LOADING";

const INIT = "init/INIT";
const LINK = "init/LINK";

const setloading = () => ({ type: SET_LOADING });
const unsetloading = () => ({ type: UNSET_LOADING });

export const startInit = (payload) => ({ type: INIT, payload });

const initialState = {
  loading: true,
};

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
