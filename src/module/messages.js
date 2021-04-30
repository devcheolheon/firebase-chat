import { takeEvery, put, call, select, takeLatest } from "redux-saga/effects";
import { eventChannel } from "redux-saga/";

import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
  getMessage as getMessageAPI,
  setMessagesRead as setMessagesReadAPI,
  messagesSnapshotChannel,
} from "../firebaseUtils/messages";

import {
  setMessage as setMessageInChat,
  setMessages as setMessagesInChat,
} from "../module/chats";

const GET_MESSAGES = "messages/GET_MESSAGES";
const SET_MESSAGES = "messages/SET_MESSAGES";

const SEND_MESSAGE = "messages/SEND_MESSAGE";

const GET_MESSAGE = "messages/GET_MESSAGE";
const SET_MESSAGE = "messages/SET_MESSAGE";
const SET_MESSAGES_READ = "messages/SET_MESSAGES_READ";

const ADD_LINK_TO_CHAT_MESSAGE = "messages/ADD_LINK_TO_CHAT_MESSAGE";
const CLOSE_LINK_TO_CHAT_MESSAGE = "messages/CLOSE_LINK_TO_CHAT_MESSAGE";

export const sendMessage = (payload) => ({
  type: SEND_MESSAGE,
  payload,
});

export const setMessage = (payload) => ({
  type: SET_MESSAGE,
  payload: { message: payload, meta: payload.id },
});

export const getMessage = (payload) => ({
  type: GET_MESSAGE,
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

export const setMessagesRead = (payload) => ({
  type: SET_MESSAGES_READ,
  payload,
});

export const addLinkToChatMessages = (payload) => ({
  type: ADD_LINK_TO_CHAT_MESSAGE,
  payload,
});

export const closeLinkToChatMessages = (payload) => ({
  type: CLOSE_LINK_TO_CHAT_MESSAGE,
  payload,
});

export function* setMessagesReadSaga(action) {
  const uid = yield select((state) => state.auth.uid);
  yield call(setMessagesReadAPI, { ...action.payload, uid });
}

function* getMessageSaga(action) {
  let message = yield call(getMessageAPI, action.payload);
  yield put(setMessages({ [message.id]: message }));
  yield put(
    setMessagesInChat({ messages: [message], meta: action.payload.chat })
  );
}

export function* getMessagesSaga(action) {
  let messages = yield call(getMessagesAPI, action.payload);
  let messagesDic = {};
  messages.forEach((message) => (messagesDic[message.id] = message));
  yield put(setMessages(messagesDic));
  yield put(setMessagesInChat({ messages, meta: action.payload.chat }));
}

function* sendMessageSaga(action) {
  const targets = yield select(
    (state) => state.chats[action.payload.chat].users
  );
  yield call(sendMessageAPI, { ...action.payload, targets });
}

function* addLinkToChatMessagesSaga(action) {
  const uid = yield select((state) => state.auth.uid);
  yield linkToChatMessagesSaga(action.payload.chat, uid);
}

export function* initLinkToChatMessagesSaga() {
  const myChats = yield select(
    (state) => (state.auth.uid && state.users[state.auth.uid].chats) || []
  );
  for (let i = 0; i < myChats.length; i++) {
    yield put(addLinkToChatMessages({ chat: myChats[i] }));
  }
}

function makeCloseChannel(chatId, channel) {
  return function* closeChannel(action) {
    if (action.payload.chat == chatId) {
      channel.close();
    }
  };
}

function* linkToChatMessagesSaga(chatId, uid) {
  const channel = createMessagesChannel(chatId, uid);
  yield takeEvery(channel, setChangesToChannel);
  yield takeEvery(
    CLOSE_LINK_TO_CHAT_MESSAGE,
    makeCloseChannel(chatId, channel)
  );
}

function createMessagesChannel(chatId, uid) {
  return eventChannel((emitter) =>
    messagesSnapshotChannel(emitter, chatId, uid)
  );
}

function* setChangesToChannel(action) {
  console.log("message: ", action);
  switch (action.type) {
    case "added": {
      let exist = yield select((state) => state.messages[action.payload.id]);
      if (exist) return;
      yield put(setMessage(action.payload));
      yield put(
        setMessageInChat({ ...action.payload, meta: action.payload.chat })
      );
      return;
    }
    case "modified": {
      yield put(setMessage(action.payload));
    }
  }
}

export function* messagesSaga() {
  yield takeEvery(GET_MESSAGES, getMessagesSaga);
  yield takeEvery(GET_MESSAGE, getMessageSaga);
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(ADD_LINK_TO_CHAT_MESSAGE, addLinkToChatMessagesSaga);
  yield takeLatest(SET_MESSAGES_READ, setMessagesReadSaga);
}

const initialState = {};

export default function messages(state = initialState, action) {
  let id = action.payload && action.payload.meta;
  let param = action.payload && action.payload.param;

  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        [id]: action.payload.message,
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
