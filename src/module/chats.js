import { takeEvery, getContext, put, call } from "redux-saga/effects";
import { createChat } from "../firebaseUtils/chats";

const CREATE_CHATS = "chats/CREATE_CHATS";
const ADD_CHATS = "chats/ADD_CHATS";

export const createChats = (payload) => ({ type: CREATE_CHATS, payload });

const addChats = (payload) => ({ type: ADD_CHATS, payload });
// saga에서만 호출하는 action

function* createChatsSaga(action) {
  let id = yield call(createChat, action.payload);
  if (id != "") {
    yield put(addChats({ ...action.payload, meta: id }));
  }
}

export function* chatsSaga() {
  yield takeEvery(CREATE_CHATS, createChatsSaga);
}

const initialState = {
  chats: [],
};

export default function chat(state = initialState, action) {
  const id = action.payload && action.payload.meta;

  switch (action.type) {
    case ADD_CHATS:
      return {
        ...state,
        chats: state[id] ? state.chats : state.chats.concat(id),
        [id]: action.payload,
      };
    default:
      return state;
  }
}
