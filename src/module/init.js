import { takeEvery, put, select } from "redux-saga/effects";
import { getChatsSaga } from "../module/chats";
import { getUsersSaga } from "../module/users";
import { getMessages, getMessagesSaga } from "../module/messages";

const SET_LOADING = "init/SET_LOADING";
const UNSET_LOADING = "init/UNSET_LOADING";
const INIT = "init/INIT";

const setloading = () => ({ type: SET_LOADING });
const unsetloading = () => ({ type: UNSET_LOADING });
export const startInit = (payload) => ({ type: INIT, payload });

const initialState = {
  loading: false,
};

export function* initDataSaga(action) {
  yield put(setloading());
  yield getChatsSaga();
  yield getUsersSaga();
  let chats = yield select(
    (state) => state.users[action.payload.uid].chats || []
  );
  for (let chatId of chats) {
    yield getMessagesSaga(getMessages({ chat: chatId }));
  }
  yield put(unsetloading());
}

export function* initSaga() {
  yield takeEvery(INIT, initDataSaga);
}

export default function init(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { loading: true };
    case UNSET_LOADING:
      return { loading: false };
    default:
      return state;
  }
}
