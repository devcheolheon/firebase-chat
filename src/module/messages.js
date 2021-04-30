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

/////////
// MESSAGE CRUD
// 메시지를 받아오고 세팅함
// 사가에서 메시지가 속한 chat에 세팅하는 action을 발생하도록 함

const GET_MESSAGE = "messages/GET_MESSAGE";
// 채팅방에 속하는 모든 메시지를 가져옴
const SET_MESSAGE = "messages/SET_MESSAGE";

const GET_MESSAGES = "messages/GET_MESSAGES";
// message의 id를 통해 가져옴
const SET_MESSAGES = "messages/SET_MESSAGES";

/////////
// MESSAGE 관련 작업들

const SET_MESSAGES_READ = "messages/SET_MESSAGES_READ";
// 채팅방내 모든 message들 각각에 읽은 사람 리스트에 사용자를 추가함

const SEND_MESSAGE = "messages/SEND_MESSAGE";
// message를 발송함
// ** 현재 채팅방내 있는 user를 target으로 전달

const ADD_LINK_TO_CHAT_MESSAGE = "messages/ADD_LINK_TO_CHAT_MESSAGE";
const CLOSE_LINK_TO_CHAT_MESSAGE = "messages/CLOSE_LINK_TO_CHAT_MESSAGE";
// join / unjoin ( chat 모듈 ) 하거나 최초 초기화시 발생하는 액션
// 채팅내 message 컬렉션의 변경사항을 구독하거나 구독 취소함

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

// initLinkToChatMessagesSaga

// 초기화 작업시, 사용자가 참여하고 있는 채팅방 정보를 가져와
// 미리 해당 chat의 메시지 콜렉션을 구독하도록 함

export function* initLinkToChatMessagesSaga() {
  const myChats = yield select(
    (state) => (state.auth.uid && state.users[state.auth.uid].chats) || []
  );
  for (let i = 0; i < myChats.length; i++) {
    yield put(addLinkToChatMessages(myChats[i]));
  }
}

export function* setMessagesReadSaga({ payload: chat }) {
  const uid = yield select((state) => state.auth.uid);
  yield call(setMessagesReadAPI, { chat, uid });
}

function* getMessageSaga({ payload: { chat, message } }) {
  message = yield call(getMessageAPI, { chat, message });
  yield put(setMessage(message));
  yield put(setMessagesInChat({ messages: [message], chat }));
}

export function* getMessagesSaga({ payload: { chat, uid } }) {
  let messages = yield call(getMessagesAPI, { chat, uid });
  let messagesDic = {};
  messages.forEach((message) => (messagesDic[message.id] = message));
  yield put(setMessages(messagesDic));
  yield put(setMessagesInChat({ messages, chat }));
}

function* sendMessageSaga({ payload: message }) {
  const targets = yield select((state) => state.chats[message.chat].users);
  yield call(sendMessageAPI, { ...message, targets });
}

function* addLinkToChatMessagesSaga({ payload: chat }) {
  const uid = yield select((state) => state.auth.uid);
  yield linkToChatMessagesSaga(chat, uid);
}

function makeCloseChannel(chatId, channel) {
  return function* closeChannel({ payload: chat }) {
    if (chat == chatId) {
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
