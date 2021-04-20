import { takeEvery, put, call } from "redux-saga/effects";

import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
} from "../firebaseUtils/messages";

import {
  setMessage as setMessageInChat,
  setMessages as setMessagesInChat,
} from "../module/chats";

import produce from "immer";

const GET_MESSAGES = "messages/GET_MESSAGES";
const SET_MESSAGES = "messages/SET_MESSAGES";

const SEND_MESSAGE = "messages/SEND_MESSAGE";
const SET_MESSAGE = "messages/SET_MESSAGE";

export const sendMessage = (payload) => ({
  type: SEND_MESSAGE,
  payload,
});

const setMessage = (payload) => ({
  type: SET_MESSAGE,
  payload,
});

export const getMessages = (payload) => ({
  type: GET_MESSAGES,
  payload,
});

export const setMessages = (payload) => ({
  type: SET_MESSAGES,
  payload,
});

export function* getMessagesSaga(action) {
  let messages = yield call(getMessagesAPI, action.payload);
  yield put(setMessagesInChat({ messages, meta: action.payload.chat }));
  let messagesDic = {};
  messages.forEach((message) => (messagesDic[message.id] = message));
  yield put(setMessages(messagesDic));
}

function* sendMessageSaga(action) {
  let message = yield call(sendMessageAPI, action.payload);
  if (message.id !== "") {
    yield put(setMessage({ ...message, meta: message.id }));
    yield put(setMessageInChat({ ...message, meta: message.chat }));
  }
}

export function* messagesSaga() {
  yield takeEvery(GET_MESSAGES, getMessagesSaga);
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
}

const initialState = {};

export default function messages(state = initialState, action) {
  let id = action.payload && action.payload.meta;
  let param = action.payload && action.payload.param;

  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        [id]: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
