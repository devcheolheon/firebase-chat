import { takeEvery, put, call } from "redux-saga/effects";
import {
  createChat,
  getAllChats,
  joinChats as joinChatAPI,
  unjoinChats as unjoinChatAPI,
} from "../firebaseUtils/chats";
import { userJoinChat, userUnjoinChat } from "./users";
import produce from "immer";

const CREATE_CHATS = "chats/CREATE_CHATS";
const ADD_CHATS = "chats/ADD_CHATS";

const GET_CHATS = "chats/GET_CHATS";
const SET_CHATS = "chats/SET_CHATS";

const JOIN_CHAT = "chats/JOIN_CHAT";
const UNJOIN_CHAT = "chats/UNJOIN_CHAT";

const SET_MESSAGE = "chats/SET_MESSAGE";
const SET_MESSAGES = "chats/SET_MESSAGES";

export const createChats = (payload) => ({ type: CREATE_CHATS, payload });
const addChats = (payload) => ({ type: ADD_CHATS, payload });
// saga에서만 호출하는 action

export const getChats = () => ({ type: GET_CHATS });
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

// user reducer에서 처리

function* createChatsSaga(action) {
  let id = yield call(createChat, action.payload);
  if (id != "") {
    yield put(addChats({ ...action.payload, meta: id }));
  }
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

function* joinChatSaga(action) {
  yield put(
    userJoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield call(joinChatAPI, action.payload);
}

function* unJoinChatSaga(action) {
  yield put(
    userUnjoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield call(unjoinChatAPI, action.payload);
}

export function* chatsSaga() {
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
    case SET_CHATS: {
      return {
        ...state,
        ...action.payload.chatsDic,
        chats: action.payload.chats,
      };
    }

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
