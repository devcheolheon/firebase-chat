import React, { useState, useCallback, useEffect } from "react";
import { BsChat } from "react-icons/bs";
import Popup from "../components/common/Popup";
import Styles from "../bootstrap/chatrooms.module.css";
import logo from "../logo.png";
import { linkToChatRoomList, createRoom } from "../utils/libFirebase";
import { useImmer } from "use-immer";

const ChatRoomLi = ({ id, name }) => {
  return (
    <li class="nav-item" key={id}>
      <a data-id={id} href="#" class="nav-link text-white">
        <BsChat size={"1.4rem"} class="pb-1"></BsChat> {name}
      </a>
    </li>
  );
};

const Content = ({ setClose }) => {
  const [name, setName] = useState("");

  const makeRoom = useCallback(async (name) => {
    await createRoom(name);
    setClose(true);
  }, []);

  return (
    <div className={Styles.popupContent}>
      <h1>채팅방 이름을 입력하세요 </h1>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        ></input>
        <button type="submit" onClick={(e) => makeRoom(name)}>
          방 만들기{" "}
        </button>
      </div>
    </div>
  );
};

const ChatRooms = () => {
  const [close, setClose] = useState(false);
  const [chatRooms, setChatRooms] = useImmer([]);

  const addChatRooms = useCallback((newRoom) => {
    setChatRooms((draft) => {
      draft.push(newRoom);
    });
  }, []);

  const removeChatRooms = useCallback((newRoom) => {
    setChatRooms((draft) => draft.filter((v) => v.id !== newRoom.id));
  }, []);

  useEffect(() => {
    linkToChatRoomList({ onAdded: addChatRooms, onRemoved: removeChatRooms });
  }, []);

  return (
    <div class="d-flex w-100 h-100">
      <Popup Content={Content} close={close} setClose={setClose}></Popup>
      <div
        class="d-flex flex-column p-3 text-white bg-dark h-100"
        style={{ width: "280px" }}
      >
        <img class="mb-4" src={logo}></img>
        <a
          href="/"
          class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span class="fs-4">채팅방 </span>
        </a>
        <hr />
        <ul class="nav d-flex flex-column nav-pills">
          <li class="nav-item">
            <a href="#" class="nav-link" onClick={() => setClose(false)}>
              + <BsChat size={"1.4rem"} class="pb-1"></BsChat> 채팅방 추가하기
            </a>
          </li>
        </ul>
        <hr />

        <ul class="nav nav-pills flex-column mb-auto">
          {chatRooms.map(({ name, id }) => (
            <ChatRoomLi name={name} id={id}></ChatRoomLi>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRooms;
