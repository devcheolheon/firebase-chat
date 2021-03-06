import { takeEvery, put, call } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { getUsers as apiGetUsers } from "../firebaseUtils/users";
import { usersSnapshotChannel } from "../firebaseUtils/users";

import produce from "immer";

const ADD_USER = "users/ADD_USER";
const UPDATE_USER = "users/UPDATE_USER";
const DELETE_USER = "users/DELETE_USER";
const GET_USER = "users/GET_USER";
const SET_USER = "users/SET_USER";
const GET_USERS = "users/GET_USERS";
const SET_USERS = "users/SET_USERS";

const USER_JOIN_CHAT = "users/USER_JOIN_CHAT";
const USER_UNJOIN_CHAT = "users/USER_UNJOIN_CHAT";

const LINK_TO_USERS = "users/LINK_TO_USERS";
const CLOSE_ALL_LINK_TO_USERS = "users/CLOSE_ALL_LINK_TO_USERS";

const initialState = { users: [] };

export const addUser = (payload) => ({
  type: ADD_USER,
  payload: { user: payload, meta: payload.uid },
});

export const updateUser = (payload) => ({
  type: UPDATE_USER,
  payload: { user: payload, meta: payload.uid },
});

export const deleteUser = (payload) => ({
  type: DELETE_USER,
  payload: { user: payload, meta: payload.uid },
});

export const getUser = (id) => ({
  type: GET_USER,
  meta: id,
});

export const getUsers = () => ({
  type: GET_USERS,
});

export const setUsers = (payload) => ({
  type: SET_USERS,
  payload,
});

export const userJoinChat = ({ uid, chat }) => ({
  type: USER_JOIN_CHAT,
  payload: { meta: uid, param: chat },
});

export const userUnjoinChat = ({ uid, chat }) => ({
  type: USER_UNJOIN_CHAT,
  payload: { meta: uid, param: chat },
});

export const linkToUsers = () => ({
  type: LINK_TO_USERS,
});

export const closeAllLinkToUsers = () => ({
  type: CLOSE_ALL_LINK_TO_USERS,
});

export const getUsersSaga = function* () {
  const users = yield call(apiGetUsers);
  const payload = {};
  payload.users = users.map((user) => user.uid);
  payload.userDic = {};
  users.forEach((user) => (payload.userDic[user.uid] = user));
  yield put(setUsers(payload));
};

function makeCloseChannel(channel) {
  return function* closeChannel() {
    channel.close();
  };
}

function* linkToUsersSaga() {
  const usersChannel = createUsersChannel();
  yield takeEvery(usersChannel, setChangesToUsers);
  yield takeEvery(CLOSE_ALL_LINK_TO_USERS, makeCloseChannel(usersChannel));
}

function createUsersChannel() {
  return eventChannel((emitter) => usersSnapshotChannel(emitter));
}

function* setChangesToUsers(action) {
  switch (action.type) {
    case "added": {
      yield put(addUser(action.payload));
      return;
    }
    case "modified": {
      yield put(updateUser(action.payload));
      return;
    }
    case "removed": {
      yield put(deleteUser(action.payload));
      return;
    }
  }
}

export function* usersSaga() {
  yield takeEvery(GET_USERS, getUsersSaga);
  yield takeEvery(LINK_TO_USERS, linkToUsersSaga);
}

export default function users(state = initialState, action) {
  const id = action.payload && action.payload.meta;
  const param = action.payload && action.payload.param;

  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        ...action.payload.userDic,
        users: action.payload.users,
      };

    case SET_USER:
      return produce(state, (draft) => {
        if (!draft[id]) {
          draft.users.push(id);
          draft[id] = action.payload.user;
        }
      });

    case UPDATE_USER:
      return {
        ...state,
        [id]: { ...state[id], ...action.payload.user },
      };

    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user !== id),
        [id]: undefined,
      };

    case ADD_USER:
      return produce(state, (draft) => {
        if (!draft[id]) {
          draft.users.push(id);
          draft[id] = action.payload.user;
        }
      });

    case USER_JOIN_CHAT:
      return produce(state, (draft) => {
        if (draft[id].chats && draft[id].chats.indexOf(param) < 0) {
          draft[id].chats.push(param);
        } else {
          draft[id].chats = [param];
        }
      });

    case USER_UNJOIN_CHAT:
      return produce(state, (draft) => {
        if (draft[id].chats) {
          let index = draft[id].chats.indexOf(param);
          if (index < 0) return;
          draft[id].chats.splice(index, 1);
        } else {
          draft[id].chats = [];
        }
      });

    default:
      return state;
  }
}
