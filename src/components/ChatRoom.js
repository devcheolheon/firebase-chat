import React, { useState, useCallback } from "react";
import Styles from "../bootstrap/chatroom.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";

import Loading from "../components/common/Loading";
import { addChatToRoom } from "../utils/libFirebase";
import useCheckLogin from "../hooks/useCheckLogin";

const SelectRoomPlease = () => {
  return (
    <div className={Styles.background}>
      <h1> 방을 선택해 주세요 </h1>
    </div>
  );
};

const chats = [];

const Chat = ({ id, userId, text }) => {
  return (
    <div className={Styles.chats}>
      <span>${userId} : </span> <span>{text}</span>
    </div>
  );
};

const ChatRoom = ({ id, name }) => {
  let [content, setContent] = useState("");
  let [loading, setLoading] = useState(false);

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

  if (id === "") {
    return <SelectRoomPlease></SelectRoomPlease>;
  }

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
