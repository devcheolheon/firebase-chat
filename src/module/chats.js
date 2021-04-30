import { takeEvery, put, call, select } from "redux-saga/effects";
import {
  chatsSnapshotChannel,
  createChat as createChatAPI,
  getAllChats,
  joinChats as joinChatAPI,
  unjoinChats as unjoinChatAPI,
} from "../firebaseUtils/chats";
import { userJoinChat, userUnjoinChat } from "./users";
import {
  addLinkToChatMessages,
  closeLinkToChatMessages,
  getMessage,
  getMessages,
  getMessagesSaga,
} from "./messages";
import produce from "immer";
import { eventChannel } from "@redux-saga/core";

/////////
// 초기화
// 초기화 할때 한번만 실행되는 액션들 (init 모듈에서 발생시킴)

const SET_CHATS = "chats/SET_CHATS";
// chat과 관련된 초기 데이터를 스토어에 바로 대입하는 액션

const LINK_TO_CHATS = "chats/LINK_TO_CHATS";
// chat 컬렉션과 연결

/////////
// CHAT CRUD

const SET_CHAT = "chats/SET_CHAT";
// chats컬렉션에 chat이 변경된 것이 발견되었을때의 액션

const ADD_CHAT = "chats/ADD_CHAT";
// chats컬렉션에 chat이 추가된 것이 발견됬을때의 액션

const CREATE_CHAT = "chats/CREATE_CHAT";
// 사용자가 chat을 생성한 액션

const JOIN_CHAT = "chats/JOIN_CHAT";
const UNJOIN_CHAT = "chats/UNJOIN_CHAT";
// chat document 내부 user 리스트에 사용자를 추가하거나 제거하는 액션

/////////
// message 관련 작업
// 이 액션들은 메시지 모듈에서 메시지를 가져오고나면 가져온 데이터를 가지고
// 호출해주는 액션 ( 모듈들 사이에서만 쓰임 )

const SET_MESSAGE = "chats/SET_MESSAGE";
// 1개의 메시지를 추가하는 액션
//   ( 최근 메시지를 채팅 리스트에서 보여주기위해 사용됨 )
const SET_MESSAGES = "chats/SET_MESSAGES";
// 여러개의 메시지를 추가하는 액션
//   ( 초기화 또는 채팅방 입장시 사용됨 )

const setChats = (payload) => ({ type: SET_CHATS, payload });

export const linkToChats = () => ({
  type: LINK_TO_CHATS,
});

const setChat = (payload) => ({
  type: SET_CHAT,
  payload: { chat: payload, meta: payload.id },
});

export const addChat = (payload) => ({
  type: ADD_CHAT,
  payload: { chat: payload, meta: payload.id },
});

export const createChat = (payload) => ({ type: CREATE_CHAT, payload });

export const joinChat = ({ id, uid }) => ({
  type: JOIN_CHAT,
  payload: { meta: id, param: uid },
});

export const unjoinChat = ({ id, uid }) => ({
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

// getChatsSaga

// 초기화 과정에서 최초의 chat 리덕스
// 상태값을 생성하여 세팅하는 사가

export function* getChatsSaga() {
  let chats = yield call(getAllChats);
  const payload = {};
  payload.chats = chats.map((chat) => chat.id);
  payload.chatsDic = {};
  chats.forEach((chat) => (payload.chatsDic[chat.id] = chat));
  yield put(setChats(payload));
}

// linkToChatsSaga

// 초기화 과정에서 chats 컬렉션의 변경사항을 앱이
// observe하도록 등록하는 사가

function* linkToChatsSaga() {
  const chatsChannel = createChatsChannel();
  yield takeEvery(chatsChannel, setChangesToChannel);
}

function createChatsChannel() {
  return eventChannel((emitter) => chatsSnapshotChannel(emitter));
}

// setChangesToChannel

// chats 컬렉션에 변경사항에 따라 채팅앱의 상태를 업데이트함

function* setChangesToChannel(action) {
  switch (action.type) {
    case "added": {
      yield put(addChat(action.payload));
    }
    case "modified": {
      let messageId = action.payload.recentMessage;
      if (!messageId) return;

      let exist = yield select((state) => state.messages[messageId]);
      let myChats = yield select(
        (state) => state.users[state.auth.uid].chats || []
      );

      // 채팅방의 최신 메시지아이디에 해당되는 메시지가 없고
      // ( recentMessage 값은 최신 메시지의 id)
      // 사용자가 현재 이 채팅방에 입장한 상태라면,
      // 메시지를 가져옴
      if (!exist && myChats.indexOf(action.payload.id) > -1) {
        yield put(
          getMessage({
            chat: action.payload.id,
            message: messageId,
          })
        );
      }

      yield put(setChat(action.payload));
    }
  }
}

// createChatSaga

// CREATE_CHAT 액션이 발생하면
// firebase chats collection 에 chat을 추가 한다
// 또한 생성한 사용자를 이 chat에 join하게 함
// (추가 사항은 이 액션에서가 아니라 collection을
//  observe 하던 사가에서 리덕스에서 적용)

function* createChatSaga(action) {
  const id = yield call(createChatAPI, action.payload);
  yield put(joinChat({ id, uid: action.payload.userId }));
}

// joinChatSaga

// JOIN_CHAT 액션이 발생하면
// 해당 chat의 메시지를 가져오고 chat 상태에 적용시킨다. (messages 모듈)
// 또한 users 리덕스 상태를 변경시키고 (users 모듈)
// chat 의 메시지 컬렉션의 변경사항을 듣는 채널을 발생시킨다 (messages 모듈)
// 마지막으로 chat에 user에 사용자를 추가하는 api를 실행한다

function* joinChatSaga(action) {
  yield put(setChat({ id: action.payload.meta, isLoading: true }));
  yield getMessagesSaga(
    getMessages({ chat: action.payload.meta, uid: action.payload.param })
  );
  yield put(
    userJoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield put(setChat({ id: action.payload.meta, isLoading: false }));
  yield put(addLinkToChatMessages({ chat: action.payload.meta }));
  yield call(joinChatAPI, action.payload);
}

// JOIN_CHAT 액션이 발생하면

// 또한 users 리덕스 상태를 변경시킨다 (users 모듈)
// chat 의 메시지 컬렉션의 변경사항을 듣는 채널을 닫는다 (messages 모듈)
// 마지막으로 chat내부 user에서 사용자를 빼는 api를 실행한다

function* unJoinChatSaga(action) {
  yield put(
    userUnjoinChat({ meta: action.payload.param, param: action.payload.meta })
  );
  yield put(closeLinkToChatMessages({ chat: action.payload.meta }));
  yield call(unjoinChatAPI, action.payload);
}

export function* chatsSaga() {
  yield takeEvery(LINK_TO_CHATS, linkToChatsSaga);
  yield takeEvery(CREATE_CHAT, createChatSaga);
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
      return {
        ...state,
        [id]: { ...state[id], ...action.payload.chat },
      };

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
          let message = draft[id].messages.find(
            ({ id: cid }) => cid == action.payload.id
          );
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
            let exist = draft[id].messages.find(
              ({ id: cid }) => cid == message.id
            );
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
