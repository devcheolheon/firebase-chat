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

const LOADING_START = "chats/LOADING_START";
const LOADING_FINISH = "chats/LOADING_FINISH";

const GET_CHATS = "chats/GET_CHATS";
const SET_CHATS = "chats/SET_CHATS";

const JOIN_CHAT = "chats/JOIN_CHAT";
const UNJOIN_CHAT = "chats/UNJOIN_CHAT";

const SET_MESSAGE = "chats/SET_MESSAGE";

export const createChats = (payload) => ({ type: CREATE_CHATS, payload });
const addChats = (payload) => ({ type: ADD_CHATS, payload });
// saga에서만 호출하는 action

const loadingStart = () => ({ type: LOADING_START });
const loadingFinish = () => ({ type: LOADING_FINISH });

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
// user reducer에서 처리

function* createChatsSaga(action) {
  let id = yield call(createChat, action.payload);
  if (id != "") {
    yield put(addChats({ ...action.payload, meta: id }));
  }
}

function* getChatsSaga() {
  yield put(loadingStart());
  let chats = yield call(getAllChats);
  const payload = {};
  payload.chats = chats.map((chat) => chat.id);
  payload.chatsDic = {};
  chats.forEach((chat) => (payload.chatsDic[chat.id] = chat));
  yield put(setChats(payload));
  yield put(loadingFinish());
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
  yield takeEvery(GET_CHATS, getChatsSaga);
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
    case LOADING_START: {
      return {
        ...state,
        loading: true,
      };
    }

    case LOADING_FINISH: {
      return {
        ...state,
        loading: false,
      };
    }

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
          if (!message) return;
        } else {
          draft[id].messages = [
            { id: action.payload.id, created: action.payload.created },
          ];
        }
      });

    default:
      return state;
  }
}
