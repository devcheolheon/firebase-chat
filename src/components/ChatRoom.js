import React, { useState, useCallback, useEffect } from "react";
import Styles from "../bootstrap/chatroom.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";
import { useImmer } from "use-immer";

import Loading from "../components/common/Loading";
import { addChatToRoom } from "../utils/libFirebase";
import useCheckLogin from "../hooks/useCheckLogin";

import { linkToChatList } from "../utils/libFirebase";

const Chat = ({ userId, content }) => {
  return (
    <div className={Styles.chats}>
      <span>${userId} : </span> <span>{content}</span>
    </div>
  );
};

const ChatRoom = ({ id, name }) => {
  let [content, setContent] = useState("");
  let [loading, setLoading] = useState(false);
  let [chats, setChats] = useImmer([]);

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
      setLoading(true);
      await addChatToRoom({ chatRoomId: id, userId, content });
      setLoading(false);
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
    setChats([]);
    linkToChatList({ roomId: id, onAdded, onRemoved, onModified });
  }, [id]);

  return loading ? (
    <Loading></Loading>
  ) : (
    <div className={Styles.chatRoom}>
      <header> 채팅방 이름 : {name} </header>
      <hr></hr>
      <div className={Styles.chatsArea}>{chats.map(Chat)}</div>
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
