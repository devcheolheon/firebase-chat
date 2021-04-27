import { takeEvery, put, call } from "redux-saga/effects";
import {
  chatsSnapshotChannel,
  createChat,
  getAllChats,
  joinChats as joinChatAPI,
  unjoinChats as unjoinChatAPI,
} from "../firebaseUtils/chats";
import { userJoinChat, userUnjoinChat } from "./users";
import {
  addLinkToChatMessages,
  closeLinkToChatMessages,
  getMessage,
} from "./messages";
import produce from "immer";
import { eventChannel } from "@redux-saga/core";

const CREATE_CHATS = "chats/CREATE_CHATS";
const ADD_CHAT = "chats/ADD_CHAT";
const ADD_CHATS = "chats/ADD_CHATS";

const UPDATE_CHAT = "chats/UPDATE_CHAT";

const GET_CHATS = "chats/GET_CHATS";
const SET_CHAT = "chats/SET_CHAT";
const SET_CHATS = "chats/SET_CHATS";

const JOIN_CHAT = "chats/JOIN_CHAT";
const UNJOIN_CHAT = "chats/UNJOIN_CHAT";

const SET_MESSAGE = "chats/SET_MESSAGE";
const SET_MESSAGES = "chats/SET_MESSAGES";

const LINK_TO_CHATS = "chats/LINK_TO_CHATS";

export const createChats = (payload) => ({ type: CREATE_CHATS, payload });
const addChats = (payload) => ({ type: ADD_CHATS, payload });

export const getChats = () => ({ type: GET_CHATS });

const setChat = (payload) => ({ type: SET_CHAT, payload, meta: payload.id });
const setChats = (payload) => ({ type: SET_CHATS, payload });

export const joinChats = ({ id, uid }) => ({
  type: JOIN_CHAT,
  payload: { meta: id, param: uid },
});

export const unjoinChats = ({ id, uid }) => ({
  type: UNJOIN_CHAT,
  payload: { meta: id, param: uid },
});

export const setMessage = (payload) => ({
  type: SET_MESSAGE,
  payload,
});

export const setMessages = (payload) => ({
  type: SET_MESSAGES,
  payload,
});

export const linkToChats = () => ({
  type: LINK_TO_CHATS,
});

export const updateChat = (payload) => ({
  type: UPDATE_CHAT,
  payload,
});

export const addChat = (payload) => ({
  type: ADD_CHAT,
  payload: { chat: payload, meta: payload.id },
});

// user reducer에서 처리

function* createChatsSaga(action) {
  const id = yield call(createChat, action.payload);
  yield put(joinChats({ id, uid: action.payload.userId }));
}

export function* getChatsSaga() {
  let chats = yield call(getAllChats);
  console.log(chats);
  const payload = {};
  payload.chats = chats.map((chat) => chat.id);
  payload.chatsDic = {};
  chats.forEach((chat) => (payload.chatsDic[chat.id] = chat));
  yield put(setChats(payload));
}

function* linkToChatsSaga() {
  const chatsChannel = createChatsChannel();
  yield takeEvery(chatsChannel, setChangesToChannel);
}

function createChatsChannel() {
  return eventChannel((emitter) => chatsSnapshotChannel(emitter));
}

function* setChangesToChannel(action) {
  console.log(action);
  switch (action.type) {
    case "added": {
      yield put(addChat(action.payload));
    }
    case "modified": {
      yield put(setChat(action.payload));
      if (action.payload.recentMessage) {
        yield put(
          getMessage({
            chat: action.payload.id,
            message: action.payload.recentMessage,
          })
        );
      }
    }
  }
}

function* joinChatSaga(action) {
  yield put(
    userJoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield put(addLinkToChatMessages({ chat: action.payload.meta }));
  yield call(joinChatAPI, action.payload);
}

function* unJoinChatSaga(action) {
  yield put(
    userUnjoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield put(closeLinkToChatMessages({ chat: action.payload.meta }));
  yield call(unjoinChatAPI, action.payload);
}

export function* chatsSaga() {
  yield takeEvery(LINK_TO_CHATS, linkToChatsSaga);
  yield takeEvery(CREATE_CHATS, createChatsSaga);
  yield takeEvery(JOIN_CHAT, joinChatSaga);
  yield takeEvery(UNJOIN_CHAT, unJoinChatSaga);
}

const initialState = {
  chats: [],
};

export default function chat(state = initialState, action) {
  const id = action.payload && action.payload.meta;

  switch (action.type) {
    case SET_CHAT:
      return produce(state, (draft) => {
        draft[id] = action.payload;
        draft.chats.push(id);
        return draft;
      });

    case SET_CHATS: {
      return {
        ...state,
        ...action.payload.chatsDic,
        chats: action.payload.chats,
      };
    }

    case ADD_CHAT:
      return produce(state, (draft) => {
        if (draft[id]) {
          return draft;
        } else {
          draft[id] = action.payload.chat;
          if (draft.chats) {
            draft.chats.push(id);
          } else {
            draft.chats = [id];
          }
          return draft;
        }
      });

    case ADD_CHATS:
      return produce(state, (draft) => {
        if (draft.chats) {
          draft.chats.push(id);
        } else {
          draft.chats = [id];
        }
        draft[id] = action.payload;
      });

    case JOIN_CHAT:
      return produce(state, (draft) => {
        if (
          draft[id].users &&
          draft[id].users.indexOf(action.payload.param) < 0
        ) {
          draft[id].users.push(action.payload.param);
        } else {
          draft[id].users = [action.payload.param];
        }
      });

    case UNJOIN_CHAT:
      return produce(state, (draft) => {
        if (draft[id].users) {
          let index = draft[id].users.indexOf(action.payload.param);
          if (index < 0) return;
          draft[id].users.splice(index, 1);
        } else {
          draft[id].users = [];
        }
      });

    case SET_MESSAGE:
      return produce(state, (draft) => {
        if (draft[id].messages) {
          let message = draft[id].messages.find(({ id: cid }) => cid == id);
          if (message) return;
          draft[id].messages.push({
            id: action.payload.id,
            created: action.payload.created,
          });
        } else {
          draft[id].messages = [
            { id: action.payload.id, created: action.payload.created },
          ];
        }
      });

    case SET_MESSAGES:
      return produce(state, (draft) => {
        if (draft[id].messages) {
          action.payload.messages.forEach((message) => {
            let exist = draft[id].messages.find(({ id: cid }) => cid == id);
            if (exist) return;
            draft[id].messages.push({
              id: message.id,
              created: message.created,
            });
          });
        } else {
          draft[id].messages = action.payload.messages.map(
            ({ id, created }) => ({
              id,
              created,
            })
          );
        }
      });
    default:
      return state;
  }
}
