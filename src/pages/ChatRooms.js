import React, { useState, useCallback, useEffect } from "react";
import { BsChat } from "react-icons/bs";
import Popup from "../components/common/Popup";
import ChatRoom from "../components/ChatRoom";
import Styles from "../bootstrap/chatrooms.module.css";
import logo from "../logo.png";
import { linkToChatRoomList, createRoom } from "../utils/libFirebase";
import { useImmer } from "use-immer";

const ChatRoomLi = ({ id, name, selected, onClick }) => {
  console.log(`${id} - selected: ${selected}`);
  return (
    <li class="nav-item" key={id}>
      <a
        id={id}
        href="#"
        className={"nav-link " + (selected ? "active" : "text-white")}
        onClick={onClick}
      >
        <BsChat size={"1.4rem"} class="pb-1"></BsChat> {name}
      </a>
    </li>
  );
};

const Content = ({ setClose, select }) => {
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
  const [selectedChatRoom, setSelectedChatRoom] = useState("");

  const addChatRooms = useCallback((newRoom) => {
    setChatRooms((draft) => {
      draft.push(newRoom);
    });
  }, []);

  const removeChatRooms = useCallback((newRoom) => {
    setSelectedChatRoom("");
    setChatRooms((draft) => draft.filter((v) => v.id !== newRoom.id));
  }, []);

  const onClickChatRoomLi = useCallback((event) => {
    event.preventDefault();
    setSelectedChatRoom(event.target.id);
  }, []);

  useEffect(() => {
    console.log(selectedChatRoom);
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
            <ChatRoomLi
              name={name}
              id={id}
              onClick={onClickChatRoomLi}
              selected={id === selectedChatRoom}
            ></ChatRoomLi>
          ))}
        </ul>
      </div>
      <ChatRoom
        id={selectedChatRoom}
        name={
          selectedChatRoom !== ""
            ? chatRooms.find((room) => room.id == selectedChatRoom)["name"]
            : ""
        }
      ></ChatRoom>
    </div>
  );
};

export default ChatRooms;
