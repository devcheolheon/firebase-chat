/*
  {
    id: "2",
    uid: "----",
    name: "라이츄",
    content: "bbbb",
    created: "1618378653151",
  }
*/

import React, { useEffect, useRef, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import Message from "./Message.js";
import { useDispatch, useSelector } from "react-redux";
import { setMessagesRead } from "../../module/messages";

const useStyles = makeStyles((theme) => ({
  ChatList: {
    height: "630px",
    overflowY: "scroll",
  },
  root: {
    minWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px",
  },

  avatar: {
    backgroundColor: blue[500],
    marginLeft: "10px",
  },

  chatHeader: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  myChatHeader: {
    flexDirection: "row",
  },

  chatTitle: {
    display: "inline-block",
    fontSize: "1.3rem",
    marginLeft: "4px",
    color: theme.palette.text.primary,
  },

  chatCreated: {
    fontSize: "0.7rem",
  },

  chatReadCounts: {
    display: "inline-block",
    paddingLeft: "10px",
    fontSize: "0.9rem",
  },

  chatBoxContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    paddingTop: "20px",
  },

  myChatBoxContainer: {
    flexDirection: "row",
  },

  chatBox: {
    marginLeft: "40px",
    marginRight: "40px",
    fontSize: "1.3rem",
    padding: "20px",
    marginTop: "-5px",
    borderRadius: "30px 10px 30px 30px",
    backgroundColor: theme.palette.secondary.light,
    maxWidth: "calc(100% - 120px)",
    wordWrap: "break-word",
  },

  myChatBox: {
    borderRadius: "10px 30px 30px 30px",
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function MessageList({ chat }) {
  const classes = useStyles();
  const messages = useSelector((state) => state.chats[chat].messages || []);
  const dispatch = useDispatch();

  let chatEndRef = useRef();
  let chatListRef = useRef();

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    let lock = false;
    chatListRef.current?.addEventListener("scroll", () => {
      if (!lock) {
        lock = true;
        setTimeout(() => {
          dispatch(setMessagesRead({ chat }));
          lock = false;
        }, 1000);
      }
    });
  }, [chat]);

  return (
    chat && (
      <div className={classes.ChatList} ref={chatListRef}>
        {messages.map((message) => (
          <Message message={message} classes={classes}></Message>
        ))}
        <div id="chatEnd" ref={chatEndRef}></div>
      </div>
    )
  );
}
