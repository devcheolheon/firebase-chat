import { takeEvery, getContext, put, call } from "redux-saga/effects";
import { getUsers as apiGetUsers } from "../firebaseUtils/users";

const ADD_USER = "users/ADD_USER";
const UPDATE_USER = "users/UPDATE_USER";
const DELETE_USER = "users/DELETE_USER";
const GET_USER = "users/GET_USER";
const SET_USER = "users/SET_USER";
const GET_USERS = "users/GET_USERS";
const SET_USERS = "users/SET_USERS";

const LOADING_START = "users/LOADING";
const LOADING_FINISH = "users/FINISH";

/* 
user {
    id
    nickname
    email
    chattings
}
*/

const initialState = { users: [], loading: true };

export const addUser = (payload) => ({
  type: ADD_USER,
  payload,
});

export const updateUser = (id, payload) => ({
  type: UPDATE_USER,
  payload,
  meta: id,
});

export const deleteUser = (id, payload) => ({
  type: DELETE_USER,
  payload,
  meta: id,
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

export const loadingStart = () => ({
  type: LOADING_START,
});

export const loadingFinish = () => ({
  type: LOADING_FINISH,
});

const getUsersSaga = function* (type) {
  yield put(loadingStart());
  const users = yield call(apiGetUsers);
  const payload = {};
  payload.users = users.map((user) => user.uid);
  payload.userDic = {};
  users.forEach((user) => (payload.userDic[user.uid] = user));
  yield put(setUsers(payload));
  yield put(loadingFinish());
};

export function* usersSaga() {
  yield takeEvery(GET_USERS, getUsersSaga);
}

export default function users(state = initialState, action) {
  const id = action.payload && action.payload.meta;

  switch (action.type) {
    case LOADING_START:
      return {
        ...state,
        loading: true,
      };

    case LOADING_FINISH:
      return {
        ...state,
        loading: false,
      };

    case SET_USERS:
      return {
        ...state,
        ...action.payload.userDic,
        users: action.payload.users,
      };

    case SET_USER:
      return {
        ...state,
        users: state[id] ? state.users : state.users.concat(id),
        ...state,
        [id]: action.payload.user,
      };

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
      return {
        ...state,
        users: state[id] ? state.users : state.users.concat(id),
        [id]: state[id],
      };
    default:
      return state;
  }
}
