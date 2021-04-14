import React, { useState, useCallback, useEffect, useRef } from "react";
import Styles from "../bootstrap/chatroom.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";
import { useImmer } from "use-immer";

import Loading from "../components/common/Loading";
import { addChatToRoom } from "../utils/libFirebase";
import useCheckLogin from "../hooks/useCheckLogin";

import {
  linkToChatList,
  getUserNameById,
  getUnReadCount,
  addReadIds,
} from "../utils/libFirebase";

import { ChatInputText } from "../components/ChatInputText";

const Chat = ({ chatRoomId, id, userId, content }) => {
  let [loading, setLoading] = useState(true);
  let [nickname, setNickname] = useState("noname");
  let [unReadCount, setUnReadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    async function fetchNickname(userId) {
      setLoading(true);
      const name = await getUserNameById(userId);
      const unReadCount = await getUnReadCount({
        userId,
        chatId: id,
        chatRoomId,
      });

      setNickname(name);
      setUnReadCount(unReadCount);
      setLoading(false);
    }
    fetchNickname(userId);
  }, [userId]);
  return (
    <div className={Styles.chatLine}>
      <div className={Styles.chats}>
        {loading ? <Loading></Loading> : <span>{nickname} : </span>}
        <span>{content}</span>
      </div>
      <span class={Styles.unReadCount}>{unReadCount}</span>
    </div>
  );
};

const ChatRoom = ({ id, name }) => {
  let [content, setContent] = useState("");
  let [loading, setLoading] = useState(true);
  let [chats, setChats] = useImmer([]);
  let chatEndRef = useRef();

  const [loginStatus, setLoginStatus] = useCheckLogin(
    {
      setLoading,
      successUrl: "/chatRooms",
      failureUrl: "/login",
    },
    []
  );

  const addChat = useCallback(
    async ({ userId, content }) => {
      setContent("");
      if (userId == "") return;
      await addChatToRoom({ chatRoomId: id, userId, content });
    },
    [id]
  );

  const onAdded = useCallback((newChat) => {
    setChats((draft) => {
      draft.push(newChat);
    });
  }, []);

  const onRemoved = useCallback((newChat) => {
    setChats((draft) => draft.filter((chat) => chat.id !== newChat.id));
  });

  const onModified = useCallback((newChat) => {
    setChats((draft) => {
      let i = draft.findIndex((chat) => chat.id == newChat.id);
      if (i >= 0) {
        draft[i] = newChat;
      }
    });
  });

  useEffect(() => {
    setLoading(true);
    setChats([]);
    const unscribe = linkToChatList({
      roomId: id,
      onAdded,
      onRemoved,
      onModified,
    });
    setLoading(false);
    return () => unscribe();
  }, [id]);

  // ringle - sungpha 님 코드 그대로
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setAllChatsRead = useCallback(
    (roomId, chats, userId) => {
      if (userId == "") return;
      chats.forEach((chat) => {
        addReadIds({ chatId: chat.id, chatRoomId: roomId, userId });
      });
    },
    [setChats]
  );

  useEffect(() => {
    scrollToBottom();
    setAllChatsRead(id, chats, loginStatus);
  }, [chats, id]);

  return loading ? (
    <Loading></Loading>
  ) : (
    <div className={Styles.chatRoom}>
      <header> 채팅방 이름 : {name} </header>
      <hr></hr>
      <div className={Styles.chatsArea}>
        {chats.map((props) => (
          <Chat {...props} chatRoomId={id}></Chat>
        ))}
        <div id="chatEnd" ref={chatEndRef}></div>
      </div>
      <div className={Styles.messageBox}>
        <input
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></input>
        <button onClick={() => addChat({ userId: loginStatus, content })}>
          <BsArrowReturnLeft></BsArrowReturnLeft>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
