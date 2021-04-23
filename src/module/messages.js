import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { eventChannel } from "redux-saga/";

import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
  messagesSnapshotChannel,
} from "../firebaseUtils/messages";

import {
  setMessage as setMessageInChat,
  setMessages as setMessagesInChat,
} from "../module/chats";

const GET_MESSAGES = "messages/GET_MESSAGES";
const SET_MESSAGES = "messages/SET_MESSAGES";

const SEND_MESSAGE = "messages/SEND_MESSAGE";
const SET_MESSAGE = "messages/SET_MESSAGE";

const ADD_LINK_TO_CHAT_MESSAGE = "messages/ADD_LINK_TO_CHAT_MESSAGE";
const CLOSE_LINK_TO_CHAT_MESSAGE = "messages/CLOSE_LINK_TO_CHAT_MESSAGE";

export const sendMessage = (payload) => ({
  type: SEND_MESSAGE,
  payload,
});

const setMessage = (payload) => ({
  type: SET_MESSAGE,
  payload: { message: payload, meta: payload.id },
});

export const getMessages = (payload) => ({
  type: GET_MESSAGES,
  payload,
});

export const setMessages = (payload) => ({
  type: SET_MESSAGES,
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

export function* getMessagesSaga(action) {
  let messages = yield call(getMessagesAPI, action.payload);
  yield put(setMessagesInChat({ messages, meta: action.payload.chat }));
  let messagesDic = {};
  messages.forEach((message) => (messagesDic[message.id] = message));
  yield put(setMessages(messagesDic));
}

function* sendMessageSaga(action) {
  yield call(sendMessageAPI, action.payload);
}

function* addLinkToChatMessagesSaga(action) {
  yield linkToChatMessagesSaga(action.payload.chat);
}

export function* initLinkToChatMessagesSaga() {
  const myChats = yield select(
    (state) => (state.auth.uid && state.users[state.auth.uid].chats) || []
  );

  for (let i = 0; i < myChats.length; i++) {
    yield linkToChatMessagesSaga(myChats[i]);
  }
}

function makeCloseChannel(chatId, channel) {
  return function* closeChannel(action) {
    if (action.payload.chat == chatId) {
      channel.close();
    }
  };
}

function* linkToChatMessagesSaga(chatId) {
  const channel = createMessagesChannel(chatId);
  yield takeEvery(channel, setChangesToChannel);
  yield takeEvery(
    CLOSE_LINK_TO_CHAT_MESSAGE,
    makeCloseChannel(chatId, channel)
  );
}

function createMessagesChannel(chatId) {
  return eventChannel((emitter) => messagesSnapshotChannel(emitter, chatId));
}

function* setChangesToChannel(action) {
  console.log("message: ", action);
  switch (action.type) {
    case "added": {
      let exist = yield select((state) => state.messages[action.payload.id]);
      console.log("exist : ", exist);
      if (exist) return;
      yield put(setMessage(action.payload));
      yield put(
        setMessageInChat({ ...action.payload, meta: action.payload.chat })
      );
      return;
    }
    //case "modified":
    //yield put(setChat(action.payload));
    //return;
  }
}

export function* messagesSaga() {
  yield takeEvery(GET_MESSAGES, getMessagesSaga);
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(ADD_LINK_TO_CHAT_MESSAGE, addLinkToChatMessagesSaga);
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
