import React from "react";
import Styles from "../bootstrap/chatroom.module.css";
import { BsArrowReturnLeft } from "react-icons/bs";

const SelectRoomPlease = () => {
  return (
    <div className={Styles.background}>
      <h1> 방을 선택해 주세요 </h1>
    </div>
  );
};

const chats = [
  {
    id: "11",
    userId: "001",
    text: "안녕하세요",
  },

  {
    id: "22",
    userId: "002",
    text: "안녕하세요!!! ",
  },

  {
    id: "33",
    userId: "003",
    text: "반갑습니다.",
  },
];

const Chat = ({ id, userId, text }) => {
  return (
    <div className={Styles.chats}>
      <span>${userId} : </span> <span>{text}</span>
    </div>
  );
};

const ChatRoom = ({ id, name }) => {
  if (id === "") {
    return <SelectRoomPlease></SelectRoomPlease>;
  }

  return (
    <div className={Styles.chatRoom}>
      <header> 채팅방 이름 : {name} </header>
      <hr></hr>
      <div className={Styles.chatsArea}>{chats.map(Chat)}</div>
      <div className={Styles.messageBox}>
        <input type="text"></input>
        <button>
          <BsArrowReturnLeft></BsArrowReturnLeft>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
