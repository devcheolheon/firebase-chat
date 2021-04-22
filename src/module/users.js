import { takeEvery, getContext, put, call } from "redux-saga/effects";
import { getUsers as apiGetUsers } from "../firebaseUtils/users";
import { subscribeUsers } from "../firebaseUtils/users";

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

/* 
user {
    id
    nickname
    email
    chattings
}
*/

const initialState = { users: [] };

export const addUser = (payload) => ({
  type: ADD_USER,
  payload,
});

export const updateUser = (payload) => ({
  type: UPDATE_USER,
  payload,
  meta: payload.id,
});

export const deleteUser = (payload) => ({
  type: DELETE_USER,
  payload,
  meta: payload.id,
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

export const userJoinChat = (payload) => ({
  type: USER_JOIN_CHAT,
  payload,
});

export const userUnjoinChat = (payload) => ({
  type: USER_UNJOIN_CHAT,
  payload,
});

export const getUsersSaga = function* () {
  const users = yield call(apiGetUsers);
  const payload = {};
  payload.users = users.map((user) => user.uid);
  payload.userDic = {};
  users.forEach((user) => (payload.userDic[user.uid] = user));
  yield put(setUsers(payload));
};

export function* usersSaga() {
  yield takeEvery(GET_USERS, getUsersSaga);
}

export default function users(state = initialState, action) {
  const id = action.payload && action.payload.meta;

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
        [id]: { ...state.user[id], ...action.payload },
      };

    case DELETE_USER:
      return {
        ...state,
        users: users.filter((user) => user.id !== id),
        [id]: undefined,
      };

    case ADD_USER:
      return produce(state, (draft) => {
        if (!draft[id]) {
          draft.push(id);
          draft[id] = action.payload.user;
        }
      });

    case USER_JOIN_CHAT:
      return produce(state, (draft) => {
        if (
          draft[id].chats &&
          draft[id].chats.indexOf(action.payload.param) < 0
        ) {
          draft[id].chats.push(action.payload.param);
        } else {
          draft[id].chats = [action.payload.param];
        }
      });

    case USER_UNJOIN_CHAT:
      return produce(state, (draft) => {
        if (draft[id].chats) {
          let index = draft[id].chats.indexOf(action.payload.param);
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
