import React from "react";
import { BsChat } from "react-icons/bs";
import logo from "../logo.png";
const ChatRooms = () => {
  return (
    <div class="d-flex w-100 h-100">
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
            <a href="#" class="nav-link">
              + <BsChat size={"1.4rem"} class="pb-1"></BsChat> 채팅방 추가하기
            </a>
          </li>
        </ul>
        <hr />

        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item">
            <a href="#" class="nav-link active">
              <BsChat size={"1.4rem"} class="pb-1"></BsChat> Home
            </a>
          </li>
          <li>
            <a href="#" class="nav-link text-white">
              <BsChat size={"1.4rem"} class="pb-1"></BsChat> Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="nav-link text-white">
              <BsChat size={"1.4rem"} class="pb-1"></BsChat> Orders
            </a>
          </li>
          <li>
            <a href="#" class="nav-link text-white">
              <BsChat size={"1.4rem"} class="pb-1"></BsChat> Products
            </a>
          </li>
          <li>
            <a href="#" class="nav-link text-white">
              <BsChat size={"1.4rem"} class="pb-1"></BsChat> Customers
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatRooms;
